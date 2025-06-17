import React, { FC } from "react";

interface CountCardsProps {
  isManager?: boolean;
}

const CountCards: FC<CountCardsProps> = ({ isManager }) => {
  return (
    <div className="count-cards mb-4">
      <div className="row">
        {!isManager && (
          <div className="col-md-3">
            <div
              className="box"
              style={{
                background:
                  "linear-gradient(284.23deg, #D3D5FF 1.38%, #FFFFFF 99.93%)",
              }}
            >
              <span className="fw-medium">Total Users</span>
              <h3 className="mt-2" style={{ color: "#007AFF" }}>
                150
              </h3>
            </div>
          </div>
        )}
        <div className={isManager ? "col-md-4" : "col-md-3"}>
          <div
            className="box"
            style={{
              background:
                "linear-gradient(305.98deg, #FFEAEA 21.59%, #FFFFFF 100.32%)",
            }}
          >
            <span className="fw-medium">Total Urgent</span>
            <h3 className="mt-2" style={{ color: "#C20000" }}>
              05
            </h3>
          </div>
        </div>
        <div className={isManager ? "col-md-4" : "col-md-3"}>
          <div
            className="box"
            style={{
              background:
                "linear-gradient(289.18deg, #FFF2D8 27.32%, #FFFFFF 114.73%)",
            }}
          >
            <span className="fw-medium">Call To Attention</span>
            <h3 className="mt-2" style={{ color: "#FFC54D" }}>
              12
            </h3>
          </div>
        </div>
        <div className={isManager ? "col-md-4" : "col-md-3"}>
          <div
            className="box"
            style={{
              background:
                "linear-gradient(284.23deg, #E4FFF2 1.38%, #FFFFFF 99.93%)",
            }}
          >
            <span className="fw-medium">Standard</span>
            <h3 className="mt-2" style={{ color: "#018243" }}>
              08
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountCards;