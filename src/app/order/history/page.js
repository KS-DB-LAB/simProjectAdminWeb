/* eslint-disable no-shadow */
"use client";

import Auth from "src/components/Auth";
import { useAuth } from "src/components/AuthProvider";
import SearchBar from "@/components/SearchBar";
import { Table } from "flowbite-react";
import { useState, useEffect } from "react";
import { FaSort, FaCheck } from "react-icons/fa";
import Link from "next/link";
import { Listbox } from "@headlessui/react";

const options = [
  { value: "created_at", label: "날짜" },
  { value: "member_location_address", label: "위치" },
  { value: "member_order_list", label: "발주 목록" },
  { value: "member_order_total_price", label: "가격" },
  { value: "order_status", label: "발주 상태" },
];
const statusL = [{ name: "발주 준비 중" }, { name: "발주 진행 중" }, { name: "발주 완료" }];

const History = () => {
  const { initial, user, view, supabase } = useAuth();
  const [historyitems, setHistoryitems] = useState([]);
  const [orderBy, setOrderBy] = useState({ ord: "created_at", asc: false });
  const [word, setWord] = useState("");
  const [selected, setSelected] = useState(options[0].value);

  useEffect(() => {
    if (user) readhistoryitems();
  }, [user, orderBy]);

  const readhistoryitems = async () => {
    if ((word === "") | (word === null) || word === undefined) {
      const { data, error } = await supabase
        .from("order_history_table")
        .select("*")
        .eq("allocated_admin", user.email)
        .order(orderBy.ord, { ascending: orderBy.asc });
      if (error) console.log("error", error);
      else setHistoryitems(data);
    } else {
      if (selected === "member_order_total_price") {
        const { data, error } = await supabase
          .from("order_history_table")
          .select("*")
          .eq(selected, parseInt(word, 10))
          .eq("allocated_admin", user.email)
          .order(orderBy.ord, { ascending: orderBy.asc });
        if (error) console.log("error", error);
        else setHistoryitems(data);
      } else {
        const { data, error } = await supabase
          .from("order_history_table")
          .select("*")
          .eq("allocated_admin", user.email)
          .ilike(selected, `%${word}%`)
          .order(orderBy.ord, { ascending: orderBy.asc });
        if (error) console.log("error", error);
        else setHistoryitems(data);
      }
    }
  };

  const handleStatus = async (id, status) => {
    const { error } = await supabase
      .from("order_history_table")
      .update({ order_status: status })
      .eq("id", id);
    if (error) console.log("error", error);
    else return;
  };

  const StatusBox = params => {
    const [selected, setSelected] = useState(
      statusL.find(status => status.name === params?.sts) || statusL[0],
    );
    const handleSts = obj => {
      setSelected(obj);
      handleStatus(params?.id, obj.name);
    };
    return (
      <Listbox value={selected} onChange={obj => handleSts(obj)}>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 dark:bg-gray-600 sm:text-sm">
            <span className="block truncate">{selected.name}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <FaSort className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </Listbox.Button>

          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-600 sm:text-sm">
            {statusL.map((status, statusIdx) => (
              <Listbox.Option
                key={statusIdx}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active
                      ? "bg-amber-100 text-amber-900 dark:bg-purple-800  dark:text-purple-300"
                      : "text-gray-900 dark:text-gray-400"
                  }`
                }
                value={status}
              >
                {({ selected }) => (
                  <>
                    <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                      {status.name}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600 dark:text-purple-600">
                        <FaCheck className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    );
  };

  if (initial) {
    return <h3>Loading...</h3>;
  }

  if (user) {
    return (
      <div className="min-h-screen w-full">
        <p className="py-1 px-1 text-center text-xl font-bold text-gray-900 dark:text-white">
          발주 내역
        </p>
        <SearchBar
          options={options}
          onSearch={readhistoryitems}
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
                  onClick={() => setOrderBy({ ord: "created_at", asc: !orderBy.asc })}
                >
                  날짜
                  <FaSort />
                </div>
              </Table.HeadCell>
              <Table.HeadCell>
                <div
                  className="flex items-center justify-center"
                  onClick={() => setOrderBy({ ord: "member_location_address", asc: !orderBy.asc })}
                >
                  위치
                  <FaSort />
                </div>
              </Table.HeadCell>
              <Table.HeadCell>
                <div className="flex items-center justify-center">발주목록</div>
              </Table.HeadCell>
              <Table.HeadCell>
                <div
                  className="flex items-center justify-center"
                  onClick={() => setOrderBy({ ord: "member_order_total_price", asc: !orderBy.asc })}
                >
                  가격
                  <FaSort />
                </div>
              </Table.HeadCell>
              <Table.HeadCell>
                <div
                  className="flex items-center justify-center"
                  onClick={() => setOrderBy({ ord: "order_status", asc: !orderBy.asc })}
                >
                  발주 상태
                  <FaSort />
                </div>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="text-center">
              {historyitems.map(item => (
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={item.id}>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {new Date(item.created_at).toLocaleString()}
                  </Table.Cell>
                  <Table.Cell>{item.member_location_address}</Table.Cell>
                  <Table.Cell>
                    <Link href={`/order/history/${encodeURIComponent(item.id)}`}>
                      {item.member_order_list.length !== 0 && item.member_order_list.length === 1
                        ? Object.values(item.member_order_list[0])[0]
                        : item.member_order_list.length !== 0 && item.member_order_list.length > 1
                        ? Object.values(item.member_order_list[0])[0] +
                          " 외 " +
                          (item.member_order_list.length - 1) +
                          "개"
                        : "없음"}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{item.member_order_total_price}</Table.Cell>
                  <Table.Cell>
                    <StatusBox id={item.id} sts={item.order_status} />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
    );
  }

  return <Auth view={view} />;
};
export default History;
