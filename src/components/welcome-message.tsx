export function WelcomeMessage() {
    return (
        <div className="welcome-header" role="alert" id="welcome-message">
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <img
                    id="pluginIcon"
                    className="col-md"
                    src="pluginIcon.png"
                    style={{
                        height: '45px',
                        width: '45px',
                        maxWidth: '45px',
                        padding: '0',
                    }}
                    alt="pluginIcon"
                />
                <p style={{ margin: 0 }}>
                    <strong>PSChat</strong>
                    <span style={{ color: '#479DF8' }}> for Chrome</span>
                </p>
                <div style={{ flexGrow: 1 }} />
                <img
                    id="iconexit"
                    className="col-md"
                    src="iconexit.png"
                    style={{
                        height: '15px',
                        width: '15px',
                        maxWidth: '15px',
                        padding: '0',
                        cursor: 'pointer',
                        marginRight: '20px',
                    }}
                    alt="iconexit"
                />
            </div>
        </div>
    );
}
