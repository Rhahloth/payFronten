const DataCard = ({ title, value, change, icon }) => {
    const isPositive = change?.startsWith('+')
    
    return (
        <div className="home-card">
            <div className="home-card-icon">
                {icon}
            </div>
            <div className="home-card-content">
                <div className="home-card-header">
                    <span className="home-card-title">{title}</span>
                    {change && (
                        <span className={`home-card-change ${!isPositive ? 'negative' : ''}`}>
                            {change}
                        </span>
                    )}
                </div>
                <div className="home-card-value">{value}</div>
                <div className="home-card-sub">Last 30 days</div>
            </div>
        </div>
    )
}

export default DataCard