import axios from "axios";
import { Row, Col, Space, Table, Card, Input, Select } from "antd";
import { useEffect, useState } from "react";
import "./App.css";

const { Option } = Select;

const columns = [
  {
    title: "",
    dataIndex: "currencyName",
  },
  {
    title: "WE BUY",
    dataIndex: "buy",
  },
  {
    title: "EXCHANGE RATE",
    dataIndex: "exchange",
  },
  {
    title: "WE SELL",
    dataIndex: "sell",
  },
];

const TableApp = () => {
  const [dataSource, setDataSource] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [inputCurrency, setInputCurrency] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("");

  const calculateValue = (value, type) => {
    switch (type) {
      case "buy":
        return (value * (selectedCurrency * inputCurrency)).toFixed(2);
      case "sell":
        return (value * (selectedCurrency * inputCurrency)).toFixed(2);
      case "exchange":
        return (value * (selectedCurrency * inputCurrency)).toFixed(2);
      default:
        return "-";
    }
  };

  const proccesData = (data) => {
    const rates = data?.rates;
    const tempDataSource = [];
    let index = 0;

    if (!inputCurrency) {
      console.log("inputCurrencyz", data);
      for (const property in rates) {
        tempDataSource.push({
          key: index++,
          currencyName: property,
          buy: "-",
          exchange: "-",
          sell: "-",
        });
      }
      return tempDataSource;
    }

    for (const property in rates) {
      let value = rates[property];
      tempDataSource.push({
        key: index++,
        currencyName: property,
        buy: calculateValue(value, "buy"),
        exchange: calculateValue(value, "exchange"),
        sell: calculateValue(value, "sell"),
      });
    }
    return tempDataSource;
  };

  useEffect(() => {
    (async () => {
      const result = await axios.get("https://api.exchangeratesapi.io/latest");
      if (result.status !== 200) {
        return;
      }
      const data = result?.data;

      if (data) {
        setRawData(data);
      }
    })();
  }, []);

  /**
   * Similar
   * componentDidUpdate / componentRecieveProps
   */
  useEffect(() => {
    if (!rawData) {
      return;
    }
    setDataSource(proccesData(rawData));
  }, [rawData, inputCurrency, selectedCurrency]);

  const onChangeInput = (e) => {
    setInputCurrency(e.target.value);
  };

  const onChangeSelect = (val) => {
    const selectData = rawData.rates[val];
    setSelectedCurrency(selectData);
  };

  const SelectionCurrency = () => {
    return (
      <Select placeholder="Select Currency" onChange={onChangeSelect}>
        {dataSource &&
          dataSource.map((v) => {
            return <Option value={v.currencyName}>{v.currencyName}</Option>;
          })}
      </Select>
    );
  };

  return (
    <Row>
      <Col lg={{ span: 24, offset: 2 }}>
        <Space direction="vertical">
          <Card title="Table Chart Stock">
            <Input
              disabled={selectedCurrency === ""}
              placeholder="Please select currency"
              addonBefore={SelectionCurrency()}
              value={inputCurrency}
              onChange={onChangeInput}
            />
            {selectedCurrency}
            <Table dataSource={dataSource} columns={columns} />
          </Card>
        </Space>
      </Col>
    </Row>
  );
};

export default TableApp;
