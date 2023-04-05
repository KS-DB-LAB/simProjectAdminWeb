"use client";

import Auth from "src/components/Auth";
import { useAuth } from "src/components/AuthProvider";
import SearchBar from "@/components/SearchBar";
import { Table, Alert, Button } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import { useState, useEffect } from "react";
import { FaSort } from "react-icons/fa";

const options = [
  { value: "created_at", label: "날짜" },
  { value: "shop_owner_table.member_name", label: "이름" },
  { value: "owner_id", label: "아이디" },
  { value: "requested_charging_money", label: "요청 포인트" },
  { value: "charged_status", label: "충전 상태" },
];

const ChargeManage = () => {
  const { initial, user, view, supabase } = useAuth();
  const [errorMsg, setErrorMsg] = useState(null);
  const [orderBy, setOrderBy] = useState({ ord: "charged_status", asc: false });
  const [word, setWord] = useState("");
  const [selected, setSelected] = useState(options[0].value);
  const [chargeitems, setChargeitems] = useState([]);

  useEffect(() => {
    if (user) readchargeitems();
  }, [user, orderBy]);

  const readchargeitems = async () => {
    if ((word === "") | (word === null) || word === undefined) {
      const { data, error } = await supabase
        .from("charging_history_table")
        .select(
          `*,
          shop_owner_table (
            member_name
        )`,
        )
        .eq("allocated_admin", user.email)
        .order(orderBy.ord, { ascending: orderBy.asc });
      if (error) setErrorMsg(error);
      else setChargeitems(data);
    } else {
      if (selected === "requested_charging_money") {
        const { data, error } = await supabase
          .from("charging_history_table")
          .select(
            `*,
            shop_owner_table (
              member_name
          )`,
          )
          .eq("allocated_admin", user.email)
          .eq(selected, parseInt(word, 10))
          .order(orderBy.ord, { ascending: orderBy.asc });
        if (error) setErrorMsg(error);
        else setChargeitems(data);
      } else {
        const { data, error } = await supabase
          .from("charging_history_table")
          .select(
            `*,
            shop_owner_table (
              member_name
          )`,
          )
          .eq("allocated_admin", user.email)
          .ilike(selected, `%${word}%`)
          .order(orderBy.ord, { ascending: orderBy.asc });
        if (error) setErrorMsg(error);
        else setChargeitems(data);
      }
    }
  };

  const handleConfirm = async id => {
    const { data, error } = await supabase
      .from("charging_history_table")
      .update({ charged_status: "승인" })
      .eq("id", id)
      .select();
    if (error) console.log("error", error);
    else udpateCharged(data[0]);
  };
  const udpateCharged = async tgData => {
    const { data, error } = await supabase
      .from("shop_owner_table")
      .select("charged_money")
      .eq("member_id", tgData.owner_id);
    if (error) setErrorMsg(error);
    else {
      updatePoint(tgData.owner_id, data[0].charged_money + tgData.requested_charging_money);
    }
  };
  const updatePoint = async (id, point) => {
    const { error } = await supabase
      .from("shop_owner_table")
      .update({ charged_money: point })
      .eq("member_id", id);
    if (error) setErrorMsg(error);
    else {
      readchargeitems();
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
          포인트 신청 현황
        </p>
        <SearchBar
          options={options}
          onSearch={readchargeitems}
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
                  onClick={() => setOrderBy({ ord: "created_at", asc: !orderBy.asc })}
                >
                  날짜
                  <FaSort />
                </div>
              </Table.HeadCell>
              <Table.HeadCell>
                <div
                  className="flex items-center justify-center"
                  onClick={() =>
                    setOrderBy({ ord: "shop_owner_table.member_name", asc: !orderBy.asc })
                  }
                >
                  이름
                  <FaSort />
                </div>
              </Table.HeadCell>
              <Table.HeadCell>
                <div
                  className="flex items-center justify-center"
                  onClick={() => setOrderBy({ ord: "owner_id", asc: !orderBy.asc })}
                >
                  아이디
                  <FaSort />
                </div>
              </Table.HeadCell>
              <Table.HeadCell>
                <div
                  className="flex items-center justify-center"
                  onClick={() => setOrderBy({ ord: "requested_charging_money", asc: !orderBy.asc })}
                >
                  요청 포인트
                  <FaSort />
                </div>
              </Table.HeadCell>
              <Table.HeadCell>
                <div
                  className="flex items-center justify-center"
                  onClick={() => setOrderBy({ ord: "charged_status", asc: !orderBy.asc })}
                >
                  충전 상태
                  <FaSort />
                </div>
              </Table.HeadCell>
              <Table.HeadCell>승인</Table.HeadCell>
            </Table.Head>
            <Table.Body className="text-center">
              {chargeitems.map(item => (
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={item.id}>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {new Date(item.created_at).toLocaleString()}
                  </Table.Cell>
                  <Table.Cell>{item.shop_owner_table.member_name}</Table.Cell>
                  <Table.Cell>{item.owner_id}</Table.Cell>
                  <Table.Cell>{item.requested_charging_money}</Table.Cell>
                  <Table.Cell>{item.charged_status}</Table.Cell>
                  <Table.Cell>
                    <Button
                      size="small"
                      onClick={() => handleConfirm(item.id)}
                      disabled={item.charged_status === "승인"}
                    >
                      승인
                    </Button>
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

export default ChargeManage;
