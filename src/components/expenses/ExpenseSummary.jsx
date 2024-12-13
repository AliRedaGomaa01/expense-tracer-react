export default function ExpenseSummary({ expenseData, filters, ...props }) {

  return (
    <div className=" text-center">
      <p className="text-lg font-medium text-gray-700 bg-red-50">
        Total expenses{' '}
        <span className="text-red-700 font-semibold">
          {filters?.name && ' for search terms (' + filters?.name + ') '}
        </span>
        for
        <span className="text-red-700 font-semibold">
          {' '} {expenseData?.category} {' '}
        </span>
      </p>

      <p className="text-lg font-medium text-gray-700 bg-yellow-50">
        From date
        <span className="text-blue-700 font-semibold"> {expenseData?.startDate} </span>
        to date
        <span className="text-blue-700 font-semibold"> {expenseData?.endDate} </span>
        over:
        <span className="text-blue-700 font-semibold"> {expenseData?.daysBetween} </span>
        days
      </p>

      <p className="text-lg font-medium text-gray-700 bg-red-50">
        is:
        <span className="text-green-700 font-bold"> {parseFloat(expenseData?.sum).toFixed(2)} </span>
        at an average of:
        <span className="text-green-700 font-bold"> {parseFloat(expenseData?.averagePerDay).toFixed(2)} </span>
        per day

        and an average of:
        <span className="text-green-700 font-bold"> {parseFloat(expenseData?.averagePerDay * 365 / 12).toFixed(2)} </span>
        per month
        and an average of:
        <span className="text-green-700 font-bold"> {parseFloat(expenseData?.averagePerDay * 365).toFixed(2)} </span>
        per year
      </p>
    </div>
  );
}
