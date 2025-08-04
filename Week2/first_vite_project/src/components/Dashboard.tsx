interface DashboardProps {
    children: React.ReactNode
}

function Dashboard (props: DashboardProps) {
    const dashboardStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto'
    }

    return (
        <div style={dashboardStyle}>
            {props.children}
        </div>
    )
}

export default Dashboard