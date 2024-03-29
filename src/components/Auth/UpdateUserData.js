"use client";

import Auth from "src/components/Auth";
import { useAuth } from "src/components/AuthProvider";
import { useState, useEffect } from "react";
import cn from "classnames";
import { FieldArray, Field, Form, Formik, getIn } from "formik";
import * as Yup from "yup";
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";

const UpdateUserData = () => {
  const { initial, user, view, supabase, signOut } = useAuth();

  const [errorMsg, setErrorMsg] = useState(null);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    if (user) {
      const getUser = async () => {
        const { data, error } = await supabase.auth.getUser();
        if (error) setErrorMsg(error.message);
        else setUserData(data?.user?.user_metadata);
      };
      getUser();
    }
  }, []);

  const UpdateUserDataSchema = Yup.object().shape({
    bank: Yup.string().required("Required"),
    account_number: Yup.string().required("Required"),
    brands: Yup.array().of(
      Yup.string()
        .test("brand", "brand의 관리자가 이미 존재합니다.", async value => {
          const { data, error } = await supabase
            .from("brand_list")
            .select("*")
            .like("brand", `%${value}%`)
            .neq("admin", user?.id);
          if (error) return false;
          else return data.length <= 0;
        })
        // .test("brand", "해당 브랜드의 관리자로 등록되어 있습니다.", async value => {
        //   const { data, error } = await supabase
        //     .from("brand_list")
        //     .select("*")
        //     .like("brand", `%${value}%`)
        //     .eq("admin", user?.id);
        //   if (error) return false;
        //   else return data.length <= 0;
        // })
        .required("Required"),
    ),
  });

  const updateUserData = async formData => {
    await supabase.auth
      .updateUser({
        data: {
          bank: formData.bank,
          account_number: formData.account_number,
          brands: formData.brands,
        },
      })
      .then(async () => {
        formData?.brands?.forEach(async brand => {
          await supabase.from("brand_list").upsert({ brand: brand, admin: user?.id });
        });
      })
      .then(() => {
        alert("정보가 변경되었습니다.\n다시 로그인해주세요.");
        signOut();
      })
      .catch(error => {
        setErrorMsg(error.message);
      });
  };

  if (initial) <h3>Loading...</h3>;
  if (user)
    return (
      <div>
        <div className="card">
          <h2 className="w-full text-center">내정보 변경</h2>
          <Formik
            initialValues={{
              bank: userData?.bank,
              account_number: userData?.account_number,
              brands: userData?.brands,
            }}
            validationSchema={UpdateUserDataSchema}
            onSubmit={updateUserData}
            enableReinitialize
          >
            {({ values, errors, touched }) => (
              <Form className="column w-full">
                <label htmlFor="bank">은행</label>
                <Field
                  className={cn("input", errors.bank && "bg-red-50")}
                  id="bank"
                  name="bank"
                  placeholder="example@sim.com"
                  type="text"
                />
                {errors.bank && touched.bank ? (
                  <div className="text-red-600">{errors.bank}</div>
                ) : null}

                <label htmlFor="account_number">계좌번호</label>
                <Field
                  className={cn("input", errors.account_number && "bg-red-50")}
                  id="account_number"
                  name="account_number"
                  placeholder="123456789012"
                  type="text"
                />
                {errors.account_number && touched.account_number ? (
                  <div className="text-red-600">{errors.account_number}</div>
                ) : null}

                <FieldArray name="brands">
                  {arrayHelpers => (
                    <div className="flex flex-col gap-1">
                      {values.brands && values.brands.length > 0 ? (
                        values.brands.map((_, index) => (
                          <div key={index}>
                            <div className="flex flex-row items-center justify-center">
                              <Field className={"input mr-1 p-1"} name={`brands.${index}`} />
                              <FaMinusCircle
                                type="button"
                                onClick={() => arrayHelpers.remove(index)}
                              />
                              <FaPlusCircle
                                type="button"
                                onClick={() => arrayHelpers.insert(index, "")}
                              />
                            </div>
                            {getIn(errors, `brands.${index}`) &&
                            getIn(touched, `brands.${index}`) ? (
                              <div className="text-red-600">{errors.brands.at(index)}</div>
                            ) : null}
                          </div>
                        ))
                      ) : (
                        <button
                          className="button"
                          type="button"
                          onClick={() => arrayHelpers.push("")}
                        >
                          브랜드 추가하기
                        </button>
                      )}
                    </div>
                  )}
                </FieldArray>

                <button className="button-inverse w-full" type="submit">
                  변경하기
                </button>
              </Form>
            )}
          </Formik>
          {errorMsg && <div className="text-red-600">{errorMsg}</div>}
        </div>
      </div>
    );

  return <Auth view={view} />;
};

export default UpdateUserData;
