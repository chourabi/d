import React from 'react';
import firebase from '../firebase';
import NavBar from '../components/Navbar';

class Booking extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            startPoints: [],
            arrivalPoints: [],
            startPoint: null,
            destinationPoint: null,
            isLoading: false,
            routes: null,
            moneyGraph: null,
            timeGraph: null,
            moneyRoute: null,
            timeRoute: null,
            nativeRoutes: null


        }

        this.getDestinations = this.getDestinations.bind(this);
        this.startChange = this.startChange.bind(this);
        this.endChange = this.endChange.bind(this);




    }

    getAllRoutes() {
        firebase.firestore().collection('routes').get().then((data) => {

            var routes = [];
            var nativeRoutes = [];

            data.forEach(route => {
                nativeRoutes.push(route.data());
            });

            for (let i = 0; i < this.state.startPoints.length; i++) {
                var tmp = [];

                data.forEach(route => {
                    if (route.data().from === this.state.startPoints[i].id) {
                        tmp.push({
                            to: route.data().to,
                            time: route.data().time,
                            price: route.data().price
                        })

                    }

                });

                routes.push({
                    node: this.state.startPoints[i].id,
                    routes: tmp
                })

            }

            this.setState({
                routes: routes,
                nativeRoutes: nativeRoutes
            })





        }).catch((error) => {

        })
    }

    getTotalTimingForTheTrip(routes) {

        if (routes === null) {
            return '';
        }


        var tmp = 0;

        for (let i = 0; i < routes.length; i++) {
            for (let j = 0; j < this.state.nativeRoutes.length; j++) {
                if (this.state.nativeRoutes[j].from === routes[i] && this.state.nativeRoutes[j].to === routes[i + 1]) {
                    tmp = tmp + this.state.nativeRoutes[j].time;
                    console.log(this.state.nativeRoutes[j].time);

                }

            }
        }



        return tmp;
    }

    getTotalMoneyForTheTrip(routes) {

        if (routes === null) {
            return '';
        }

        var tmp = 0;

        for (let i = 0; i < routes.length; i++) {
            for (let j = 0; j < this.state.nativeRoutes.length; j++) {
                if (this.state.nativeRoutes[j].from === routes[i] && this.state.nativeRoutes[j].to === routes[i + 1]) {
                    tmp += this.state.nativeRoutes[j].price;

                }

            }
        }

        console.log(tmp);

        return tmp;
    }

    generateRouteString(routes) {
        if (routes === null) {
            return '';
        }
        var tmp = "";

        for (let i = 0; i < routes.length; i++) {
            for (let j = 0; j < this.state.startPoints.length; j++) {
                if (this.state.startPoints[j].id === routes[i]) {
                    console.log(this.state.startPoints[j].name);

                    tmp += '' + this.state.startPoints[j].name + ' / ';
                }
            }




        }



        console.log(tmp);


        return tmp;
    }


    search() {
        console.log(this.state);
        this.setState({
            isLoading: true
        })

        const Graph = require('node-dijkstra');

        const moneyGraph = new Graph()


        for (let i = 0; i < this.state.routes.length; i++) {
            var tmpNodes = "{ "
            for (let j = 0; j < this.state.routes[i].routes.length; j++) {
                if (j + 1 === this.state.routes[i].routes.length) {
                    tmpNodes += '"' + this.state.routes[i].routes[j].to + '" : ' + this.state.routes[i].routes[j].price;

                } else {
                    tmpNodes += '"' + this.state.routes[i].routes[j].to + '" : ' + this.state.routes[i].routes[j].price + ',';

                }

            }

            tmpNodes += ' }'

            console.log(JSON.parse(tmpNodes));

            moneyGraph.addNode(this.state.routes[i].node, JSON.parse(tmpNodes))

        }

        /************************************************************** */
        const timeGraph = new Graph()


        for (let i = 0; i < this.state.routes.length; i++) {
            var tmpNodes = "{ "
            for (let j = 0; j < this.state.routes[i].routes.length; j++) {
                if (j + 1 === this.state.routes[i].routes.length) {
                    tmpNodes += '"' + this.state.routes[i].routes[j].to + '" : ' + this.state.routes[i].routes[j].time;

                } else {
                    tmpNodes += '"' + this.state.routes[i].routes[j].to + '" : ' + this.state.routes[i].routes[j].time + ',';

                }

            }

            tmpNodes += ' }'

            timeGraph.addNode(this.state.routes[i].node, JSON.parse(tmpNodes))

        }

        console.log(timeGraph.path(this.state.startPoint, this.state.destinationPoint, { cost: true }));


        this.setState({
            moneyGraph: moneyGraph,
            timeGraph: timeGraph,
            moneyRoute: moneyGraph.path(this.state.startPoint, this.state.destinationPoint, { cost: true }),
            timeRoute: timeGraph.path(this.state.startPoint, this.state.destinationPoint, { cost: true }),
            isLoading: false

        })


        /************** make a string based on the graphs************* */


    }

    getDestinations() {
        firebase.firestore().collection('destinations').get().then((data) => {
            this.getAllRoutes();


            var tmp = [];
            data.forEach(des => {
                tmp.push({
                    name: des.data().name,
                    id: des.id
                })
            });

            this.setState({
                startPoints: tmp,
                arrivalPoints: tmp
            })

        }).catch((error) => {

        })
    }

    startChange(e) {
        this.setState({
            startPoint: e.target.value
        })

    }
    endChange(e) {
        this.setState({
            destinationPoint: e.target.value
        })

    }

    componentDidMount() {
        this.getDestinations();
        /*firebase.auth().onAuthStateChanged((data)=>{
            console.log(data.uid);
        })*/

    }




    render() {
        return (
            <div className="App">
                <div id="booking" className="section">

                <NavBar/>


                    <div className="section-center">
                        <div className="container">
                            <div className="row">
                                <div className="booking-form">
                                    
                                        <div className="row">
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <span className="form-label">Flying from</span>
                                                    <select className="form-control" onChange={(event) => { this.startChange(event) }}>
                                                        <option>Select a start point</option>
                                                        {
                                                            this.state.startPoints.map((destination) => {
                                                                return (
                                                                    <option key={destination.id} value={destination.id}>{destination.name}</option>
                                                                );
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <span className="form-label">Flyning to</span>
                                                    <select className="form-control" onChange={(event) => { this.endChange(event) }} >
                                                        <option>Select a destination</option>
                                                        {
                                                            this.state.startPoints.map((destination) => {
                                                                return (
                                                                    <option key={destination.id} value={destination.id}>{destination.name}</option>
                                                                );

                                                            })
                                                        }
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="col-md-4">
                                                <div className="form-btn">
                                                    <button className="submit-btn" disabled={this.state.startPoint === null || this.state.destinationPoint === null} onClick={() => { this.search() }}>Show flights</button>
                                                </div>
                                            </div>
                                        </div>

                                    
                                </div>

                                <div className="header ">
                        <div className="my-5">

                            {
                                this.state.isLoading === true ?
                                    <div className="row">
                                        <div className="my-5 col-sm-12">
                                            <p className="text-center"><strong>Searching ... </strong></p>
                                        </div>
                                    </div>
                                    :
                                    <div></div>
                            }


                            <div className="row">
                                {
                                    this.state.timeRoute !== null && this.state.timeRoute.path !== null ?
                                        <div className="col-sm-6" >
                                            <div className="card">
                                                <div className="card-body">
                                                <h3>Quickest trip</h3>
                                                <p>
                                                    from  :  {this.generateRouteString(this.state.timeRoute.path)} <br />
                                                    price :  <strong> {this.getTotalMoneyForTheTrip(this.state.timeRoute.path)} ( TND ) </strong><br />
                                                    Time  : <strong>{this.state.timeRoute.cost} ( minuts)</strong><br />

                                                    <button className=" btn btn-primary"> BOOK NOW</button>
                                                </p>
                                                
                                                </div>
                                            </div>
                                        </div> : <p></p>

                                }

                                {
                                    this.state.moneyRoute !== null && this.state.moneyRoute.path !== null ?
                                        <div className="col-sm-6" >
                                            <div className="card">
                                                <div className="card-body">
                                                <h3>Low budget trip</h3>
                                                <p>
                                                    from  : {this.generateRouteString(this.state.moneyRoute.path)}<br />
                                                    price : <strong> {this.state.moneyRoute.cost} ( TND ) </strong><br />
                                                    time  : <strong>{this.getTotalTimingForTheTrip(this.state.moneyRoute.path)} ( minuts) <br /></strong>
                                                    <button className=" btn btn-primary"> BOOK NOW</button>
                                                </p>
                                                
                                                </div>
                                            </div>
                                        </div> : <div></div>

                                }



                            </div>
                        </div>
                    </div>
                            </div>
                        </div>
                    </div>
                </div>








            </div>
        );
    }
}

export default Booking;
