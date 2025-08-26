"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Eye, EyeOff, TrendingDown, TrendingUp } from "lucide-react";

const FinancialCard = ({
  title,
  amount,
  statistic,
}: {
  title: string;
  amount: number;
  statistic: string;
}) => {
  const [eyeOff, setEyeOff] = useState(true);

  const handleEyeOff = () => {
    setEyeOff(!eyeOff);
  };

  const formatAmount = new Intl.NumberFormat("id-ID", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(amount);

  return (
    <Card className="min-w-[205px] w-[250px] h-[120px] flex-1 py-3 rounded-md flex justify-between gap-3">
      <CardHeader className="font-medium text-lg px-4 gap-0 leading-tight pb-0">
        <div className=" flex items-center gap-1 justify-between">
          <h3 className="text-base">{title}</h3>
          <button onClick={handleEyeOff}>
            {eyeOff ? (
              <EyeOff className="text-muted-foreground h-4 w-4" />
            ) : (
              <Eye className="text-muted-foreground h-4 w-4 rotate-180" />
            )}
          </button>
        </div>
      </CardHeader>
      <CardContent className="px-4 mt-2">
        <div className="flex">
          <span className="font-semibold -mt-2 mr-1">Rp.</span>
          <span className="text-xl font-semibold">
            {eyeOff ? formatAmount : "********"}
          </span>
        </div>
        {/* 
         <>
                <TrendingDown className="mr-2 text-green-600 text-base w-4 h-4" />
                <span className="text-green-600 font-semibold mr-1">
                  {statistic}%
                </span>
              </>
        */}
        <div className="flex items-center mt-1">
          {title.toLowerCase().includes("expense") ? (
            parseFloat(statistic) < 0 ? (
              <>
                <TrendingDown className="mr-2 text-green-600 text-base w-4 h-4" />
                <span className="text-green-600 font-semibold mr-1">
                  {statistic}%
                </span>
              </>
            ) : (
              <>
                <TrendingUp className="mr-2 text-red-600 text-base w-4 h-4" />
                <span className="text-red-600 font-semibold mr-1">
                  {statistic}%
                </span>
              </>
            )
          ) : parseFloat(statistic) < 0 ? (
            <>
              <TrendingDown className="mr-2 text-red-600 text-base w-4 h-4" />
              <span className="text-red-600 font-semibold mr-1">
                {statistic}%
              </span>
            </>
          ) : (
            <>
              <TrendingUp className="mr-2 text-green-600 text-base w-4 h-4" />
              <span className="text-green-600 font-semibold mr-1">
                {statistic}%
              </span>
            </>
          )}
          <p className="text-muted-foreground ml-1">From last month</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialCard;
