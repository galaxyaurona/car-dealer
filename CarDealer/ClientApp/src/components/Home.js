import React, { Component } from 'react';
import { Alert, ListGroup, ListGroupItem, Row, Col, Glyphicon } from "react-bootstrap";

function FormatMoney(money) {
  
  if (money && !isNaN(money))
    return "$ " + money.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  else
    return "$0"
}

class CustomListItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
       parentClass : "list-group-item clickable"
    }
  }
 

render(){
  const { car, onRemoveCarClick, onListItemClick } = this.props;

  return (
    <li className={this.state.parentClass} onClick={onListItemClick}>
      <h3 style={{ "margin": "5px" }}>
        {`${car.year} ${car.make} ${car.model} - ${FormatMoney(car.price)}`}
        <Glyphicon className="pull-right clickable" glyph="remove"
          onClick={onRemoveCarClick}
          onMouseEnter={() => this.setState({parentClass:"list-group-item"})}
          onMouseLeave={() => this.setState({parentClass:"list-group-item clickable"})}
        />
      </h3>

    </li>
  );
}

}


export class Home extends Component {

  constructor(props) {
    super(props)
    this.state = { cars: [], loadingErrors: [], loading: true }
    // fetching datas
    fetch('api/Cars')
      .then(response => {
        if (response.status < 300) {
          response.json().then(cars =>{
            cars = cars.concat(cars);
            cars = cars.concat(cars);
            cars = cars.concat(cars);
            cars = cars.concat(cars);
            this.setState({ cars: cars, loadingErrors: [], loading: false })
          }, error => this.setState({ cars: [], loadingErrors: ['Invalid Json structure'], loading: false }))

        }
        else {
          switch (response.status) {
            case 404:
              this.setState({ cars: [], loadingErrors: ["API route not found"], loading: false });
              break;
            default:
              this.setState({ cars: [], loadingErrors: response.json(), loading: false });
          }

        }
      })

  }

  renderLoadingError(loadingErrors) {

    if (loadingErrors && loadingErrors.length > 0) {
      return (
        <div>
          <Alert bsStyle="danger">
            {loadingErrors.join("\n")}
          </Alert>
        </div>
      )
    }
  }
  onListItemClick(car) {
    console.log("car", car)
  }

  onRemoveCarClick(event, id) {
    event.stopPropagation();
    console.log("id",id)
  }
  renderCarList(loadingErrors, cars) {
    if (!loadingErrors || (loadingErrors && loadingErrors.length == 0))
      return (
        <ListGroup componentClass="div">
          {cars.map(car => {
            return <CustomListItem key={car.id} car={car}
              onListItemClick={this.onListItemClick.bind(this, car)}
              onRemoveCarClick={(event) => this.onRemoveCarClick(event, car.id)}
            >
            </CustomListItem>
          })}
        </ListGroup>

      )

  }
  render() {
    if (this.state.loading)
      return <h1>Loading...</h1>

    return (
      <div>
        {this.renderLoadingError(this.state.loadingErrors)}
        {this.renderCarList(this.state.loadingErrors, this.state.cars)}
      </div>
    );
  }
}
