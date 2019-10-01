import React, { Component } from 'react';
import {
  Col, ListGroup,
  Form, FormGroup, FormControl, ControlLabel,
  Button,
} from "react-bootstrap";
import { CustomListItem } from "./CustomListItem"
import { ErrorsAlert } from "./ErrorsAlert"
import { ERROR_API_ROUTE_NOT_FOUND, ERROR_RESPONSE_INVALID_JSON } from '../utils';
export class SearchCar extends Component {
  displayName = SearchCar.name

  constructor(props) {
    super(props);
    this.state = {
      cars: [], loading: false, errors: [], queryString: '',
      lastQueryString: '',
    };
  }

  searchCar(event, queryString) {
    event.preventDefault();
    event.stopPropagation();
    // prevent double search
    if (queryString.trim() != this.state.lastQueryString) {
      this.setState ( {
         errors: []
        , loading: true,
        lastQueryString: queryString,
      })
      fetch(`api/Cars/search?searchTerm=${queryString}`)
        .then(response => {
          const { status } = response;
          if (status == 404) {
            this.setState({ cars: [], errors: [ERROR_API_ROUTE_NOT_FOUND], loading: false });
          } else {
            // try parsing response body as json
            response.json().then(data => {
              if (status < 300) {
                // display latest item first
                data.reverse()
                this.setState({ cars: data, errors: [], loading: false })
              } else {
                this.setState({ cars: [], errors: data, loading: false })
              }
            }, _ => this.setState({ cars: [], errors: [ERROR_RESPONSE_INVALID_JSON], loading: false }))
          }
        })
    }
  }
  onUpdatingCarSuccess(updatedCar) {
    // id i
    const updatedCarIndex = this.state.cars.findIndex(car => car.id == updatedCar.id)
    const cars = [...this.state.cars]
    cars[updatedCarIndex] = updatedCar;
    this.setState({ cars })
  }
  onRemovingCarSuccess(id) {
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
              disableControl={this.state.loading}
            >
            </CustomListItem>
          })}
        </ListGroup>
      )
  }
  render() {
    const { queryString, loading, errors, cars } = this.state;
    return (
      <div>
        <Form className="search-form" onSubmit={(event) => this.searchCar(event, queryString)} horizontal>
          <FormGroup>
            <Col componentClass={ControlLabel} xs={4}>
              Search by make or model
          </Col>
            <Col xs={6}>
              <FormControl type="text"
                required
                value={queryString}
                onChange={event => this.setState({ queryString: event.target.value })}
                placeholder="Toyota" />
            </Col>
            <Col xs={2}>
              <Button bsStyle="primary"
                type="submit"
                disabled={loading}
                style={{"width":"80px"}}
                className="pull-right">
                {
                  loading ?
                    "Loading..." : "Search"
                }
              </Button>
            </Col>
          </FormGroup>
        </Form>

        <ErrorsAlert errors={errors}></ErrorsAlert>
        {this.renderCarList(errors, cars)}
      </div>

    );
  }
}
