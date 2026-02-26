import { useNavigate } from "react-router-dom";

const SectionHeader = ({ 
    title, 
    showBack = false, 
    backTo = -1,
    showDashboard = false,
    dashboardTo = "/" 
}) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (backTo === -1) {
            navigate(-1);
        } else {
            navigate(backTo);
        }
    };

    const handleDashboard = () => {
        navigate(dashboardTo);
    };

    return (
        <div className="flex items-center justify-between px-8 py-4 page-header">
            <div className="flex items-center gap-3">
                {showBack && (
                    <button 
                        onClick={handleBack}
                        className="flex items-center gap-2 page-back-btn"
                        aria-label="Go back"
                    >
                        <span className="text-lg">←</span>
                        <span className="text-sm font-medium">Back</span>
                    </button>
                )}
                
                {showDashboard && (
                    <button 
                        onClick={handleDashboard}
                        className="flex items-center gap-2 page-dashboard-btn"
                        aria-label="Go to dashboard"
                    >
                        <span className="text-lg">🏠</span>
                        <span className="text-sm font-medium">Dashboard</span>
                    </button>
                )}
            </div>
            
            <h2 className="page-header-title">{title}</h2>
        </div>
    );
};

export default SectionHeader;