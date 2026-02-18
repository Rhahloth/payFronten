

const DataCard = ({title, value, icon}) => {
    return (
        <div className="bg-white shadow-md w-full sm:w-1/2 md:w-1/3 lg:w-[480px] rounded-lg p-4 items-center"> 
            <div className="text-3xl text-blue-500 mt-4">
                {icon}
            </div>
            <div>
                <h3 className="text-lg font-semibold text-gray-700 mt-4">{title}</h3>
                <p className="text-2xl font-bold text-gray-900 mt-4">{value}</p>
            </div>
        </div>
    )
}

export default DataCard