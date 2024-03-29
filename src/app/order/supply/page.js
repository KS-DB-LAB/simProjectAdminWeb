"use client";

import Auth from "src/components/Auth";
import { useAuth } from "src/components/AuthProvider";
import SearchBar from "@/components/SearchBar";
import { Button, Table, Modal, Alert } from "flowbite-react";
import { HiPlus, HiInformationCircle } from "react-icons/hi";
import { useState, useEffect } from "react";
import { Fragment } from "react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import cn from "classnames";
import { FaSort } from "react-icons/fa";

const options = [
  { value: "supply_item_name", label: "물품명" },
  { value: "price", label: "가격" },
  { value: "supply_item_class", label: "종류" },
  { value: "supply_item_specify_class", label: "상세종류" },
  { value: "brands", label: "브랜드" },
];

const SupplySchema = Yup.object().shape({
  id: Yup.number(),
  supply_item_name: Yup.string().required("Required"),
  supply_item_class: Yup.string().required("Required"),
  supply_item_specify_class: Yup.string().required("Required"),
  supply_item_price: Yup.string().required("Required"),
  brands: Yup.string().required("Required"),
});

const Supply = () => {
  const { initial, user, view, supabase } = useAuth();
  const [supplyItems, setSupplyItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [dModalOpen, setDModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [orderBy, setOrderBy] = useState({ ord: "supply_item_name", asc: true });
  const [word, setWord] = useState("");
  const [selected, setSelected] = useState(options[0].value);
  const [targetObj, setTargetObj] = useState({
    id: "",
    supply_item_name: "",
    supply_item_class: "",
    supply_item_specify_class: "",
    supply_item_price: "",
    brands: "",
  });

  useEffect(() => {
    if (user) readSupplyItems();
  }, [user, orderBy]);

  const readSupplyItems = async () => {
    if ((word === "") | (word === null) || word === undefined) {
      const { data, error } = await supabase
        .from("supply_item_table")
        .select("*")
        .in("brands", user?.user_metadata?.brands)
        .order(orderBy.ord, { ascending: orderBy.asc });
      if (error) setErrorMsg(error.message);
      else setSupplyItems(data);
      return;
    } else {
      const { data, error } = await supabase
        .from("supply_item_table")
        .select("*")
        .in("brands", user?.user_metadata?.brands)
        .ilike(selected, `%${word}%`)
        .order(orderBy.ord, { ascending: orderBy.asc });
      if (error) setErrorMsg(error.message);
      else setSupplyItems(data);
    }
  };

  const createSupplyItem = async formData => {
    delete formData.id;
    const { error } = await supabase.from("supply_item_table").insert(formData);
    if (error) setErrorMsg(error.message);
    else
      readSupplyItems()
        .then(() => handleClose())
        .then(() => location.reload());
  };

  const updateSupplyItem = async formData => {
    const { error } = await supabase
      .from("supply_item_table")
      .update(formData)
      .eq("id", formData.id);
    if (error) setErrorMsg(error.message);
    else readSupplyItems().then(() => handleClose());
  };

  const deleteSupplyItem = async id => {
    const { error } = await supabase.from("supply_item_table").delete().eq("id", id);
    if (error) setErrorMsg(error.message);
    else readSupplyItems().then(() => handleClose());
  };

  const handleSubmit = async formData => {
    formData.id ? updateSupplyItem(formData) : createSupplyItem(formData);
    handleClose();
  };

  const handleUpdate = async targetData => {
    setTargetObj(targetData);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setDModalOpen(false);
    setErrorMsg(null);
    setTargetObj({
      id: "",
      supply_item_name: "",
      supply_item_class: "",
      supply_item_specify_class: "",
      supply_item_price: "",
      brands: "",
    });
  };

  const valueToKor = name => {
    switch (name) {
      case "supply_item_name":
        return "물품명";
      case "supply_item_class":
        return "종류";
      case "supply_item_specify_class":
        return "상세종류";
      case "supply_item_price":
        return "가격";
      case "brands":
        return "브랜드";
      default:
        return "ID";
    }
  };

  const valueToPlaceholder = name => {
    switch (name) {
      case "supply_item_name":
        return "비빔양념(1kg)";
      case "supply_item_class":
        return "식재료";
      case "supply_item_specify_class":
        return "소스";
      case "supply_item_price":
        return "8000";
      case "brands":
        return "밀면제작소";
      default:
        return "00";
    }
  };

  if (initial) {
    return <h3 className="min-h-screen">Loading...</h3>;
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
          발주 품목
        </p>
        <SearchBar
          options={options}
          onSearch={readSupplyItems}
          word={word}
          setWord={setWord}
          selected={selected}
          setSelected={setSelected}
        />
        <div className="relative max-h-full w-full overflow-scroll shadow-md sm:rounded-lg md:max-h-screen">
          <Table>
            <Table.Head>
              <Table.HeadCell>
                <div
                  className="flex items-center justify-center"
                  onClick={() => setOrderBy({ ord: "supply_item_name", asc: !orderBy.asc })}
                >
                  물품명
                  <FaSort />
                </div>
              </Table.HeadCell>
              <Table.HeadCell>
                <div
                  className="flex items-center justify-center"
                  onClick={() => setOrderBy({ ord: "supply_item_price", asc: !orderBy.asc })}
                >
                  가격
                  <FaSort />
                </div>
              </Table.HeadCell>
              <Table.HeadCell>
                <div
                  className="flex items-center justify-center"
                  onClick={() => setOrderBy({ ord: "supply_item_class", asc: !orderBy.asc })}
                >
                  종류
                  <FaSort />
                </div>
              </Table.HeadCell>
              <Table.HeadCell>
                <div
                  className="flex items-center justify-center"
                  onClick={() =>
                    setOrderBy({ ord: "supply_item_specify_class", asc: !orderBy.asc })
                  }
                >
                  상세 종류
                  <FaSort />
                </div>
              </Table.HeadCell>
              <Table.HeadCell>
                <div
                  className="flex items-center justify-center"
                  onClick={() => setOrderBy({ ord: "brands", asc: !orderBy.asc })}
                >
                  브랜드
                  <FaSort />
                </div>
              </Table.HeadCell>
              <Table.HeadCell>
                <span className="sr-only">update</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="text-center">
              {supplyItems.map(item => (
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={item.id}>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {item.supply_item_name}
                  </Table.Cell>
                  <Table.Cell>{item.supply_item_price}</Table.Cell>
                  <Table.Cell>{item.supply_item_class}</Table.Cell>
                  <Table.Cell>{item.supply_item_specify_class}</Table.Cell>
                  <Table.Cell>{item.brands}</Table.Cell>
                  <Table.Cell>
                    <Button
                      className="hover:underlin"
                      color="green"
                      size={"xs"}
                      onClick={() => handleUpdate(item)}
                    >
                      Edit
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
        <div className="my-4 flex justify-end">
          <Button onClick={() => setModalOpen(true)}>
            <HiPlus className="mr-3 h-4 w-4" />
            추가
          </Button>
        </div>
        <>
          <Modal show={modalOpen} size="sm" onClose={handleClose}>
            <Modal.Header className="text-xs">물품 관리</Modal.Header>
            <Modal.Body>
              <Formik
                enableReinitialize
                initialValues={targetObj}
                validationSchema={SupplySchema}
                onSubmit={handleSubmit}
              >
                {({ values, errors, touched }) => (
                  <Form className="flex w-full flex-col justify-center gap-2">
                    {Object.keys(values).map((value, index) => {
                      return (
                        <label htmlFor={value} key={index} className="dark:text-white">
                          {valueToKor(value)}
                          <Field
                            className={cn(
                              "block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500",
                              errors[value] && touched[value] && "bg-red-50",
                            )}
                            id={value}
                            name={value}
                            placeholder={valueToPlaceholder(value)}
                            type="text"
                            disabled={value === "id"}
                          />
                          {errors[value] && touched[value] ? (
                            <div className="text-sm text-red-600">{errors[value]}</div>
                          ) : null}
                        </label>
                      );
                    })}
                    <br />
                    <Button.Group className="w-full">
                      <Button color="green" type="submit">
                        저장
                      </Button>
                      <Button
                        color="red"
                        onClick={() => setDModalOpen(true)}
                        disabled={values.id === ""}
                      >
                        삭제
                      </Button>
                    </Button.Group>
                  </Form>
                )}
              </Formik>
              {errorMsg && <div className="text-red-600">{errorMsg}</div>}
            </Modal.Body>
          </Modal>
          <Modal dismissible={true} show={dModalOpen} onClose={handleClose} size="sm">
            <Modal.Header>물품 삭제</Modal.Header>
            <Modal.Body>
              <div className="space-y-6">정말 삭제하시겠습니까?</div>
            </Modal.Body>
            <Modal.Footer>
              <Button color="warning" onClick={() => deleteSupplyItem(targetObj.id)}>
                삭제
              </Button>
              <Button color="gray" onClick={() => setDModalOpen(false)}>
                취소
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      </div>
    );
  }

  return <Auth view={view} />;
};

export default Supply;
