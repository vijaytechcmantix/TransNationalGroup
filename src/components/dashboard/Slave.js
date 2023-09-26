export function FirstSlave({kisokBox}){
    // ${kisokBox.length == 13 ? 'col-6' : 'col-3'}
    return( <div className={`col-3 d-flex flex-column`}>
                    <div className={`box-0 box-card`}>
                    </div>
                    <div className={`box-9 box status-${ kisokBox?.[7]?.['Enable'] ? (kisokBox[7]['Enable'] == "Yes" ? "enabled" : "disabled") : "" }`}>
                        <div className="box-heading">
                            8
                        </div>
                        <div className="box-content sub-box-content">
                        </div>
                    </div>
                    <div className={`box-10 box status-${ kisokBox?.[8]?.['Enable'] ? (kisokBox[8]['Enable'] == "Yes" ? "enabled" : "disabled") : "" }`}>
                        <div className="box-heading">
                            9
                        </div>
                        <div className="box-content sub-box-content">
                            {/* <span>IN12345678</span>
                            <span>IN2345678989</span>
                            <span>OUT12345678</span> */}
                        </div>
                    </div>
                    <div className={`box-11 box status-${ kisokBox?.[9]?.['Enable'] ? (kisokBox[9]['Enable'] == "Yes" ? "enabled" : "disabled") : "" }`}>
                        <div className="box-heading">
                            10
                        </div>
                        <div className="box-content sub-box-content">
                        </div>
                    </div>
                    <div className={`box-12 box status-${ kisokBox?.[10]?.['Enable'] ? (kisokBox[10]['Enable'] == "Yes" ? "enabled" : "disabled") : "" }`}>
                        <div className="box-heading">
                            11
                        </div>
                        <div className="box-content sub-box-content">
                            {/* <span>IN12345678</span>
                            <span>IN2345678989</span>
                            <span>OUT12345678</span> */}
                        </div>
                    </div>
                    <div className={`box-13 box status-${ kisokBox?.[11]?.['Enable'] ? (kisokBox[11]['Enable'] == "Yes" ? "enabled" : "disabled") : "" }`}>
                        <div className="box-heading">
                            12
                        </div>
                        <div className="box-content sub-box-content">
                            {/* <span>IN12345678</span>
                            <span>IN2345678989</span>
                            <span>OUT12345678</span> */}
                        </div>
                    </div>
                    <div className={`box-14 box status-${ kisokBox?.[12]?.['Enable'] ? (kisokBox[12]['Enable'] == "Yes" ? "enabled" : "disabled") : "" }`}>
                        <div className="box-heading">
                            13
                        </div>
                        <div className="box-content sub-box-content">
                            {/* <span>IN12345678</span>
                            <span>IN2345678989</span>
                            <span>OUT12345678</span> */}
                        </div>
                    </div>
                    <div className="box-0 no-storage">
                        {/* <span>Fixed panel</span> */}
                        {/* <span>(No Storage)</span> */}
                    </div>
                </div>)
}

export function SecondSlave({kisokBox}){
    return( <div className="col-3 d-flex flex-column">
                    <div className={`box-0 box-card`}>
                    </div>
                    <div className={`box-9 box status-${ kisokBox?.[13]?.['Enable'] ? (kisokBox[13]['Enable'] == "Yes" ? "enabled" : "disabled") : "" }`}>
                        <div className="box-heading">
                            14
                        </div>
                        <div className="box-content">
                        </div>
                    </div>
                    <div className={`box-17 box status-${ kisokBox?.[14]?.['Enable'] ? (kisokBox[14]['Enable'] == "Yes" ? "enabled" : "disabled") : "" }`}>
                        <div className="box-heading">
                            15
                        </div>
                        <div className="box-content sub-box-content">
                            {/* <span>IN12345678</span>
                            <span>IN2345678989</span>
                            <span>OUT12345678</span> */}
                        </div>
                    </div>
                    <div className={`box-18 box status-${ kisokBox?.[15]?.['Enable'] ? (kisokBox[15]['Enable'] == "Yes" ? "enabled" : "disabled") : "" }`}>
                        <div className="box-heading">
                            16
                        </div>
                        <div className="box-content sub-box-content">
                        </div>
                    </div>
                    <div className={`box-19 box status-${ kisokBox?.[16]?.['Enable'] ? (kisokBox[16]['Enable'] == "Yes" ? "enabled" : "disabled") : "" }`}>
                        <div className="box-heading">
                            17
                        </div>
                        <div className="box-content sub-box-content">
                            {/* <span>IN12345678</span>
                            <span>IN2345678989</span>
                            <span>OUT12345678</span> */}
                        </div>
                    </div>
                    <div className={`box-20 box status-${ kisokBox?.[17]?.['Enable'] ? (kisokBox[17]['Enable'] == "Yes" ? "enabled" : "disabled") : "" }`}>
                        <div className="box-heading">
                            18
                        </div>
                        <div className="box-content sub-box-content">
                            {/* <span>IN12345678</span>
                            <span>IN2345678989</span>
                            <span>OUT12345678</span> */}
                        </div>
                    </div>
                    <div className={`box-21 box status-${ kisokBox?.[18]?.['Enable'] ? (kisokBox[18]['Enable'] == "Yes" ? "enabled" : "disabled") : "" }`}>
                        <div className="box-heading">
                            19
                        </div>
                        <div className="box-content sub-box-content">
                            {/*<span>IN12345678</span>
                            <span>IN2345678989</span>
                            <span>OUT12345678</span> */}
                        </div>
                    </div>
                    <div className="box-0 no-storage">
                        {/* <span>Fixed panel</span> */}
                        {/* <span>(No Storage)</span> */}
                    </div>
                </div>);
}