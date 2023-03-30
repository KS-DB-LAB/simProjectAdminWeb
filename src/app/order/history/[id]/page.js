/* eslint-disable react/prop-types */
"use client";

import Auth from "src/components/Auth";
import { useAuth } from "src/components/AuthProvider";
import { useState, useEffect } from "react";
import { FaSort } from "react-icons/fa";

const Specific = ({ params }) => {
  const { initial, user, view, supabase } = useAuth();
  const [order, setOrder] = useState({});
  const { id } = params;

  useEffect(() => {
    const getHistoty = async () => {
      const { data, error } = await supabase
        .from("order_history_table")
        .select("*")
        .eq("id", id)
        .single();
      if (error) console.log("error", error);
      else setOrder(data);
    };
    getHistoty();
  }, []);

  if (initial) {
    return <h3>Loading...</h3>;
  }

  if (!user) {
    return <Auth view={view} />;
  }

  if (user && order?.member_order_list) {
    return (
      <div className="w-full">
        <h1 className="text-center text-lg font-bold">
          주문 지점 : {order.member_location_address}
        </h1>
        <h1 className="text-center text-lg font-bold">
          주문 시간 : {new Date(order.created_at).toLocaleString()}
        </h1>
        <br />
        <div className="flex justify-center">
          <div className="">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="text-left text-sm text-gray-500 dark:text-gray-400">
                <thead className="bg-gray-50 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      발주 품목 목록
                    </th>
                    <th scope="col" className="px-6 py-3">
                      <div className="flex items-center">
                        개수
                        <FaSort />
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3">
                      <div className="flex items-center">
                        금액
                        <FaSort />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.member_order_list.map((item, index) => {
                    return (
                      <tr
                        className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
                        key={index}
                      >
                        <th
                          scope="row"
                          className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                        >
                          {item.itemName}
                        </th>
                        <td className="px-6 py-4">{item.itemBuyingCount}</td>
                        <td className="px-6 py-4">
                          {parseInt(item.itemPrice) * parseInt(item.itemBuyingCount)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-b bg-green-50 dark:border-gray-700 dark:bg-gray-800">
                    <th
                      scope="row"
                      className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
                    >
                      총 금액
                    </th>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4">{order.member_order_total_price}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return <h3>Loading...</h3>;
};

export default Specific;
