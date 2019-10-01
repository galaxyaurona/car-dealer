import React, { Component } from 'react';
import { ListGroup } from "react-bootstrap";
import { ErrorsAlert } from "./ErrorsAlert"
import { CustomListItem } from "./CustomListItem"
import { AddCarForm } from "./AddCarForm"

export class Home extends Component {
  displayName = Home.name
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
    // find update item by id
    const updatedCarIndex = this.state.cars.findIndex(car => car.id == updatedCar.id)
    const cars = [...this.state.cars]
    // perform update
    cars[updatedCarIndex] = updatedCar;
    this.setState({ cars })
  }
  onRemovingCarSuccess(id) {
    // filter by id
    const cars = this.state.cars.filter(car => car.id != id)
    this.setState({ cars })
  }
  renderCarList(errors, cars) {
    if (!errors || (errors && errors.length == 0))
      return (
        <ListGroup componentClass="div">
          {cars.map(car => {
            return <CustomListItem key={car.id} car={car}
              onUpdatingItemSuccess={this.onUpdatingCarSuccess.bind(this)}
              onRemovingCarSuccess={this.onRemovingCarSuccess.bind(this)}
            >
            </CustomListItem>
          })}
        </ListGroup>
      )
  }
  onAddingCarSuccess(car) {
    const { cars } = this.state
    // adding car to the front
    cars.unshift(car);
    this.setState({ cars })
  }
  render() {
    const { loading, loadingErrors, cars } = this.state;
    // display loading when fetching data
    if (loading)
      return <h1>Loading...</h1>

    return (
      <div>
        <AddCarForm onAddingCarSuccess={this.onAddingCarSuccess.bind(this)}></AddCarForm>
        <ErrorsAlert errors={loadingErrors}></ErrorsAlert>
        {this.renderCarList(loadingErrors, cars)}
      </div>
    );
  }
}
