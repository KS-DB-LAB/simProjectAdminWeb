/* eslint-disable no-shadow */
"use client";

import Auth from "src/components/Auth";
import { useAuth } from "src/components/AuthProvider";
import SearchBar from "@/components/SearchBar";
import { Table } from "flowbite-react";
import { useState, useEffect } from "react";
import { FaSort } from "react-icons/fa";

const options = [
  { value: "member_name", label: "이름" },
  { value: "member_id", label: "아이디" },
  { value: "location_address", label: "위치" },
  { value: "charged_money", label: "잔여 포인트" },
];

const History = () => {
  const { initial, user, view, supabase } = useAuth();
  const [owneritems, setOwneritems] = useState([]);
  const [orderBy, setOrderBy] = useState({ ord: "member_name", asc: false });
  const [word, setWord] = useState("");
  const [selected, setSelected] = useState(options[0].value);

  useEffect(() => {
    readowneritems();
  }, [orderBy]);

  const readowneritems = async () => {
    if ((word === "") | (word === null) || word === undefined) {
      const { data, error } = await supabase
        .from("shop_owner_table")
        .select("*")
        .order(orderBy.ord, { ascending: orderBy.asc });
      if (error) console.log("error", error);
      else setOwneritems(data);
    } else {
      if (selected === "member_order_total_price") {
        const { data, error } = await supabase
          .from("shop_owner_table")
          .select("*")
          .eq(selected, parseInt(word, 10))
          .order(orderBy.ord, { ascending: orderBy.asc });
        if (error) console.log("error", error);
        else setOwneritems(data);
      } else {
        const { data, error } = await supabase

          .from("shop_owner_table")
          .select("*")
          .ilike(selected, `%${word}%`)
          .order(orderBy.ord, { ascending: orderBy.asc });
        if (error) console.log("error", error);
        else setOwneritems(data);
      }
    }
  };

  if (initial) {
    return <h3>Loading...</h3>;
  }

  if (user) {
    return (
      <div className="min-h-screen w-full">
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
            </Table.Head>
            <Table.Body className="text-center">
              {owneritems.map(item => (
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={item.id}>
                  <Table.Cell>{item.member_name}</Table.Cell>
                  <Table.Cell>{item.member_id}</Table.Cell>
                  <Table.Cell>{item.location_address}</Table.Cell>
                  <Table.Cell>{item.charged_money}</Table.Cell>
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
