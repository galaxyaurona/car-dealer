import React, { Component } from 'react';
import { ListGroup } from "react-bootstrap";
import { ErrorsAlert } from "./ErrorsAlert"
import { CustomListItem } from "./CustomListItem"
import { AddCarForm } from "./AddCarForm"

export class Home extends Component {

  constructor(props) {
    super(props)
    this.state = { cars: [], loadingErrors: [], loading: true }
    // fetching datas
    fetch('api/Cars')
      .then(response => {
        const { status } = response;
        if (status == 404) {
          this.setState({ cars: [], loadingErrors: ["API route not found"], loading: false });
        } else {
          // try parsing response body as json
          response.json().then(data => {
            if (status < 300) {
              // display latest item first
              data.reverse()
              this.setState({ cars: data, loadingErrors: [], loading: false })
            } else {
              this.setState({ cars: [], loadingErrors: data, loading: false })
            }
          }, _ => this.setState({ cars: [], loadingErrors: ['Invalid Json structure'], loading: false }))
        }

      })

  }

  onUpdatingCarSuccess(updatedCar) {
    // id i
    const updatedCarIndex = this.state.cars.findIndex(car => car.id == updatedCar.id)
    const cars = [...this.state.cars]
    cars[updatedCarIndex] = updatedCar;
    this.setState({ cars })
  }
  onRemoveCarClick(event, id) {
    event.stopPropagation();
    console.log("id", id)
  }
  renderCarList(loadingErrors, cars) {
    if (!loadingErrors || (loadingErrors && loadingErrors.length == 0))
      return (
        <ListGroup componentClass="div">
          {cars.map(car => {
            return <CustomListItem key={car.id} car={car}
              onUpdatingItemSuccess={this.onUpdatingCarSuccess.bind(this)}
              onRemoveCarClick={(event) => this.onRemoveCarClick(event, car.id)}
            >
            </CustomListItem>
          })}
        </ListGroup>
      )
  }
  onCarAdded(car){
    const {cars} = this.state
    cars.unshift(car);
    console.log("setting new cars", cars);
    this.setState({cars})
  }
  render() {
    const { loading, loadingErrors, cars } = this.state;
    if (loading)
      return <h1>Loading...</h1>

    return (
      <div>
        <AddCarForm onCarAdded={this.onCarAdded.bind(this)}></AddCarForm>
        <ErrorsAlert errors={loadingErrors}></ErrorsAlert>
        {this.renderCarList(loadingErrors, cars)}
      </div>
    );
  }
}
