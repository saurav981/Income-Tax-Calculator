import { useEffect, useState } from "react";

import { useThemeStore } from "../stores/store";

export const IncomeTaxCalculator = () => {
  const { theme } = useThemeStore();

  const [rawSalary, setRawSalary] = useState("");
  const [salary, setSalary] = useState("");
  const [salaryAfterDeduction, setSalaryAfterDeduction] = useState("");
  const [rebate, setRebate] = useState("");
  const [cess, setCess] = useState("");
  const [tax, setTax] = useState("");
  const [currency, setCurrency] = useState("");
  // const [usdToINR, setUsdToINR] = useState("");

  // Change currency INR/USD
  function currencyChangeHandle(e) {
    setCurrency(e.target.value);
    setSalary("");
    setRawSalary("");
  }

  // Call API to get USD to INR value, only calls on mount
  // useEffect(() => {
  //   fetch(
  //     "https://api.currencyapi.com/v3/latest?apikey=cur_live_yjgcdRnNgtyEkKPljsITd3NjAGKgDcChX6Cdl91H&currencies=INR"
  //   )
  //     .then((res) => res.json())
  //     .then((output) => {
  //       setUsdToINR(output.data.INR.value.toFixed(2));
  //     })
  //     .catch((error) => console.log("Error fetching data", error));
  // }, []);

  // console.log(usdToINR);

  function salaryCalculation(e) {
    setSalary(
      e.target.value * `${currency === "USD" ? `${83 * 1000}` : 100000}`
    );
    setRawSalary(e.target.value);
  }

  useEffect(() => {
    setSalaryAfterDeduction(salary - 75000);

    const slab5Perc =
      salaryAfterDeduction > 300000
        ? salaryAfterDeduction > 700000 && salaryAfterDeduction <= 722222
          ? 0
          : salaryAfterDeduction > 700000
          ? (700000 - 300000) * 0.05
          : (salaryAfterDeduction - 300000) * 0.05
        : 0;

    const slab10Perc =
      salaryAfterDeduction > 700000
        ? salaryAfterDeduction > 700000 && salaryAfterDeduction <= 722222
          ? salaryAfterDeduction - 700000
          : salaryAfterDeduction > 1000000
          ? (1000000 - 700000) * 0.1
          : (salaryAfterDeduction - 700000) * 0.1
        : 0;

    const slab15Perc =
      salaryAfterDeduction > 1000000
        ? salaryAfterDeduction > 1200000
          ? (1200000 - 1000000) * 0.15
          : (salaryAfterDeduction - 1000000) * 0.15
        : 0;

    const slab20Perc =
      salaryAfterDeduction > 1200000
        ? salaryAfterDeduction > 1500000
          ? (1500000 - 1200000) * 0.2
          : (salaryAfterDeduction - 1200000) * 0.2
        : 0;

    const slab30Perc =
      salaryAfterDeduction > 1500000
        ? (salaryAfterDeduction - 1500000) * 0.3
        : 0;

    const allSlabTotal =
      slab5Perc + slab10Perc + slab15Perc + slab20Perc + slab30Perc;

    setRebate(salaryAfterDeduction <= 700000 ? allSlabTotal : 0);
    setCess((allSlabTotal - rebate) * 0.04);
    setTax(allSlabTotal + cess - rebate);
  });

  // Convert 300000 to 3,00,000
  function formatIndianStyle(number) {
    return number.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
  }

  // Display/outputs
  const salaryDisplay = `₹ ${formatIndianStyle(salary)}`;
  const salaryAfterSDDisplay = `₹ ${formatIndianStyle(salaryAfterDeduction)}`;
  const taxPayableDisplay = `₹ ${formatIndianStyle(tax)}`;
  // const monthlyTaxPayableDisplay = `₹ ${formatIndianStyle(
  //   (tax / 12).toFixed(0)
  // )}`;
  const taxPercDisplay = `${((tax / salary) * 100).toFixed(2)} %`;
  const inHandSalaryDisplay = `₹ ${formatIndianStyle(
    ((salary - tax) / 12).toFixed(0)
  )}`;

  const allOutputArray = [
    { color: "f5debc", title: "Total Income", value: salaryDisplay },
    { color: "f4c8a6", title: "Standard Deduction", value: "₹ -75,000" },
    { color: "eca77f", title: "Taxable Income", value: salaryAfterSDDisplay },
    { color: "ffb6a3", title: "Income Tax", value: taxPayableDisplay },
    { color: "ecaac6", title: "Tax %", value: taxPercDisplay },
    { color: "f9fba5", title: "In hand monthly", value: inHandSalaryDisplay },
  ];

  return (
    <div
      className={`${
        theme === "dark" ? "dark-theme" : "light-theme"
      } h-[calc(100vh-53px)] screen flex items-center justify-center`}
    >
      <div className="w-full shadow-xl max-w-lg border-[1.5px] border-gray-500/20 p-3.5 py-10 sm:p-10 rounded-lg mx-3 text-[1.1rem]">
        <h1 className="text-[1.7rem] font-bold text-center">
          Income Tax Calculator 2024-25
        </h1>

        <div className="mt-8 flex flex-col gap-3">
          <div className="flex justify-between items-center gap-1">
            <p className="max-sm:text-[1rem]">Enter salary in LPA</p>

            <select
              name="currency"
              id="currency"
              onChange={currencyChangeHandle}
              className="bg-transparent max-sm:text-sm max-sm:border border-gray-400/30 p-1  rounded-md"
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
            </select>

            <input
              min={1}
              max={1000}
              onChange={salaryCalculation}
              value={rawSalary}
              type="number"
              placeholder="Salary..."
              className="min-w-36 sm:min-w-40 p-2 px-3 rounded-lg bg-transparent border border-gray-500 outline-none"
            />
          </div>

          {rawSalary && (
            <>
              {allOutputArray.map((item) => (
                <div
                  key={item.title}
                  className="flex justify-between items-center"
                >
                  <p>{item.title}</p>

                  <div
                    style={{ backgroundColor: `#${item.color}` }}
                    className={`min-w-36 sm:min-w-40 h-10 p-2 px-3 rounded-lg ${
                      theme === "dark" && "text-black opacity-90"
                    }`}
                  >
                    {salary > 0 && item.value}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
