import React from "react";

class ConfirmPopup extends React.Component {

 


    render() {
        if (!this.props.isOpen) return null;

        return (
            <div
                style={{position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)",
                    display: "flex", justifyContent: "center", alignItems: "center", zIndex: 99999}}
            >
                <div
                    style={{width: "400px", maxWidth: "90vw", backgroundColor: "white", borderRadius: "12px", padding: "24px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.25)", textAlign: "center"}}
                >
                    <h2 style={{ marginTop: 0, color: "#000" }}>
                        {this.props.header || "Placeholder."}
                    </h2>

                    <p style={{ margin: "20px 0", color: "#444" }}>
                        {this.props.message || "Placeholder. If you see this, report this error."}
                    </p>

                    <div
                        style={{display: "flex", justifyContent: "center", gap: "12px"}}
                    >
                        
                        
                        <button
                            onClick={this.props.onClose}
                            style={{backgroundColor: "#6c757d", color: "white", border: "none",
                                padding: "10px 20px", borderRadius: "6px", cursor: "pointer"}}
                        >
                            Cancel
                        </button>


                        <button
                            onClick={async () => {
                                await this.props.onSubmit();
                                this.props.onClose();
                            }}
                            style={{backgroundColor: "#43dc35", color: "white", border: "none", padding: "10px 20px",
                                borderRadius: "6px", cursor: "pointer"}}
                        >
                            Confirm
                        </button>                        
                    </div>
                </div>
            </div>
        );
    }
}

export default ConfirmPopup;