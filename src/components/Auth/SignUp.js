"use client";

import { useState } from "react";
import cn from "classnames";
import { Field, Form, Formik, FieldArray, getIn } from "formik";
import * as Yup from "yup";
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import { useAuth, VIEWS } from "src/components/AuthProvider";
import supabase from "src/lib/supabase-browser";

const SignUpSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
  bank: Yup.string().required("Required"),
  account_number: Yup.string().required("Required"),
  brands: Yup.array().of(
    Yup.string()
      .test("brand", "brand의 관리자가 이미 존재합니다.", async value => {
        const { data, error } = await supabase
          .from("brand_list")
          .select("brand")
          .like("brand", `%${value}%`);
        if (error) return false;
        else return data.length <= 0;
      })
      .required("Required"),
  ),
});

const SignUp = () => {
  const { setView } = useAuth();
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const signUp = async formData => {
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          bank: formData.bank,
          account_number: formData.account_number,
          brands: formData.brands,
        },
      },
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg("회원가입이 완료되었습니다. 이메일을 확인해주세요.");
      formData?.brands?.forEach(async brand => {
        await supabase.from("brand_list").insert({ brand: brand });
      });
    }
  };

  return (
    <div className="min-h-screen">
      <div className="card">
        <h2 className="w-full text-center">회원가입</h2>
        <Formik
          initialValues={{
            email: "",
            password: "",
            bank: "",
            account_number: "",
            brands: [],
          }}
          validationSchema={SignUpSchema}
          onSubmit={signUp}
        >
          {({ values, errors, touched }) => (
            <Form className="column w-full">
              <label htmlFor="email">이메일</label>
              <Field
                className={cn("input", errors.email && "bg-red-50")}
                id="email"
                name="email"
                placeholder="example@sim.com"
                type="email"
              />
              {errors.email && touched.email ? (
                <div className="text-red-600">{errors.email}</div>
              ) : null}

              <label htmlFor="email">비밀번호</label>
              <Field
                className={cn("input", errors.password && touched.password && "bg-red-50")}
                id="password"
                name="password"
                type="password"
              />
              {errors.password && touched.password ? (
                <div className="text-red-600">{errors.password}</div>
              ) : null}

              <label htmlFor="bank">은행</label>
              <Field
                className={cn("input", errors.bank && touched.bank && "bg-red-50")}
                id="bank"
                name="bank"
                type="text"
              />
              {errors.password && touched.password ? (
                <div className="text-red-600">{errors.password}</div>
              ) : null}

              <label htmlFor="email">계좌번호</label>
              <Field
                className={cn(
                  "input",
                  errors.account_number && touched.account_number && "bg-red-50",
                )}
                id="account_number"
                name="account_number"
                type="text"
              />
              {errors.password && touched.password ? (
                <div className="text-red-600">{errors.password}</div>
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
                          {getIn(errors, `brands.${index}`) && getIn(touched, `brands.${index}`) ? (
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

              <button className="button w-full" type="submit">
                가입
              </button>
            </Form>
          )}
        </Formik>
        {errorMsg && <div className="text-red-600">{errorMsg}</div>}
        {successMsg && <div className="text-black">{successMsg}</div>}
        <button className="link w-full" type="button" onClick={() => setView(VIEWS.SIGN_IN)}>
          이미 계정이 있으신가요? 로그인하러가기
        </button>
      </div>
    </div>
  );
};

export default SignUp;
