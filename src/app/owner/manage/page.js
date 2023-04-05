/* eslint-disable no-shadow */
"use client";

import Auth from "src/components/Auth";
import { useAuth } from "src/components/AuthProvider";
import SearchBar from "@/components/SearchBar";
import { useState, useEffect } from "react";
import { FaSort } from "react-icons/fa";
import { HiInformationCircle } from "react-icons/hi";
import { Button, Table, Modal, Alert } from "flowbite-react";
import { Fragment } from "react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import cn from "classnames";

const options = [
  { value: "member_name", label: "이름" },
  { value: "member_id", label: "아이디" },
  { value: "location_address", label: "위치" },
  { value: "charged_money", label: "잔여 포인트" },
  { value: "allocated_status", label: "승인 상태" },
];

const PointSchema = Yup.object().shape({
  point: Yup.number()
    .required("포인트를 입력해주세요")
    .positive("포인트는 양수만 입력해주세요")
    .integer("포인트는 정수만 입력해주세요"),
});

const History = () => {
  const { initial, user, view, supabase } = useAuth();

  const [owneritems, setOwneritems] = useState([]);
  const [orderBy, setOrderBy] = useState({ ord: "member_name", asc: false });
  const [word, setWord] = useState("");
  const [selected, setSelected] = useState(options[0].value);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [targetPoint, setTargetPoint] = useState({
    id: 0,
    point: 0,
  });

  useEffect(() => {
    if (user) readowneritems();
  }, [user, orderBy]);

  const readowneritems = async () => {
    if ((word === "") | (word === null) || word === undefined) {
      const { data, error } = await supabase
        .from("shop_owner_table")
        .select("*")
        .eq("allocated_admin", user.email)
        .order("allocated_status")
        .order(orderBy.ord, { ascending: orderBy.asc });
      if (error) setErrorMsg(error);
      else setOwneritems(data);
    } else {
      if (selected === "member_order_total_price") {
        const { data, error } = await supabase
          .from("shop_owner_table")
          .select("*")
          .eq(selected, parseInt(word, 10))
          .order(orderBy.ord, { ascending: orderBy.asc });
        if (error) setErrorMsg(error);
        else setOwneritems(data);
      } else {
        const { data, error } = await supabase
          .from("shop_owner_table")
          .select("*")
          .ilike(selected, `%${word}%`)
          .order(orderBy.ord, { ascending: orderBy.asc });
        if (error) setErrorMsg(error);
        else setOwneritems(data);
      }
    }
  };

  const handleEditPoint = (id, point) => {
    setTargetPoint({ id, point });
    setModalOpen(true);
  };

  const handleClose = () => {
    setTargetPoint({ id: 0, point: 0 });
    setModalOpen(false);
  };

  const handleSubmit = async formData => {
    const { error } = await supabase
      .from("shop_owner_table")
      .update({ charged_money: formData.point })
      .eq("id", targetPoint.id);
    if (error) setErrorMsg(error);
    else {
      readowneritems();
    }
    handleClose();
  };

  const handleConfirmUser = async id => {
    const { error } = await supabase
      .from("shop_owner_table")
      .update({ allocated_status: 1, member_brand: user?.user_metadata?.brands })
      .eq("id", id);
    if (error) setErrorMsg(error);
    else readowneritems();
  };

  if (initial) {
    return <h3>Loading...</h3>;
  }

  if (user) {
    return (
      <div className="min-h-screen w-full">
        {errorMsg && (
          <Alert color="failure" icon={HiInformationCircle} onClose={() => setErrorMsg(null)}>
            <span>
              <span className="font-medium">Error!</span> {errorMsg}
            </span>
          </Alert>
        )}
        <p className="py-1 px-1 text-center text-xl font-bold text-gray-900 dark:text-white">
          지점 관리
        </p>
        <SearchBar
          options={options}
          onSearch={readowneritems}
          word={word}
          setWord={setWord}
          selected={selected}
          setSelected={setSelected}
        />
        <div className="relative mb-6 min-h-[50vh] w-full overflow-x-auto sm:rounded-lg">
          <Table>
            <Table.Head>
              <Table.HeadCell>
                <div
                  className="flex items-center justify-center"
                  onClick={() => setOrderBy({ ord: "member_name", asc: !orderBy.asc })}
                >
                  이름
                  <FaSort />
                </div>
              </Table.HeadCell>
              <Table.HeadCell>
                <div
                  className="flex items-center justify-center"
                  onClick={() => setOrderBy({ ord: "member_id", asc: !orderBy.asc })}
                >
                  아이디
                  <FaSort />
                </div>
              </Table.HeadCell>
              <Table.HeadCell>
                <div
                  className="flex items-center justify-center"
                  onClick={() => setOrderBy({ ord: "location_address", asc: !orderBy.asc })}
                >
                  위치
                  <FaSort />
                </div>
              </Table.HeadCell>
              <Table.HeadCell>
                <div
                  className="flex items-center justify-center"
                  onClick={() => setOrderBy({ ord: "charged_money", asc: !orderBy.asc })}
                >
                  잔여 포인트
                  <FaSort />
                </div>
              </Table.HeadCell>
              <Table.HeadCell>
                <div
                  className="flex items-center justify-center"
                  onClick={() => setOrderBy({ ord: "allocated_status", asc: !orderBy.asc })}
                >
                  승인 여부
                  <FaSort />
                </div>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="text-center">
              {owneritems.map(item => (
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={item.id}>
                  <Table.Cell>{item.member_name}</Table.Cell>
                  <Table.Cell>{item.member_id}</Table.Cell>
                  <Table.Cell>{item.location_address}</Table.Cell>
                  <Table.Cell>
                    <div onClick={() => handleEditPoint(item.id, item.charged_money)}>
                      {item.charged_money}
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div onClick={() => handleConfirmUser(item.id)}>
                      {item.allocated_status === 1 ? "승인됨" : "미승인"}
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
        <Fragment>
          <Modal show={modalOpen} size="sm" onClose={handleClose}>
            <Modal.Header className="text-xs">포인트 수정</Modal.Header>
            <Modal.Body>
              <Formik
                enableReinitialize
                initialValues={{
                  point: targetPoint.point,
                }}
                validationSchema={PointSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, values, errors, touched }) => (
                  <Form>
                    <div className="space-y-6">
                      <div className="space-y-1">
                        {Object.keys(values).map((value, index) => {
                          return (
                            <label htmlFor={value} className="text-xs" key={index}>
                              포인트
                              <Field
                                id={value}
                                name={value}
                                type="number"
                                className={cn(
                                  "block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500",
                                  errors[value] && touched[value] && "bg-red-50",
                                )}
                              />
                              {errors[value] && touched[value] ? (
                                <div className="text-sm text-red-600">{errors[value]}</div>
                              ) : null}
                            </label>
                          );
                        })}
                      </div>
                      <div className="flex justify-end">
                        <Button color="gray" className="w-20" onClick={handleClose}>
                          취소
                        </Button>
                        <Button
                          color="warning"
                          className="w-20"
                          type="submit"
                          disabled={isSubmitting}
                        >
                          확인
                        </Button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </Modal.Body>
          </Modal>
        </Fragment>
      </div>
    );
  }

  return <Auth view={view} />;
};
export default History;
