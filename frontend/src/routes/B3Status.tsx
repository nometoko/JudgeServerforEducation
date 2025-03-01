import { useState, useEffect } from 'react';
import { DefaultLayout } from "../components/DefaultLayout";
import { B3results } from "../components/B3results"
import { B3StatusProps } from "../components/B3results";
import myaxios from "../providers/axios_client";

const B3Status = () => {
  const [data, setData] = useState<B3StatusProps[]>([]);

  useEffect(() => {
    (async () => {
      try {
        console.log("🔄 B3ステータスを取得...");
        const { data } = await myaxios.get(`/handler/getB3Status`)
        setData(data);
      }
      catch (error) {
        console.log(error)
        setData([]);
      }
    })()
  }, []);

  return (
    <DefaultLayout>
      <B3results data={data} />
    </DefaultLayout>
  );
};

export default B3Status;
