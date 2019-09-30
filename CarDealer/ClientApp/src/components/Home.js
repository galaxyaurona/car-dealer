import React, { Component } from 'react';
import {
  Alert, ListGroup,
  ListGroupItem, Row, Col, Glyphicon,
  Form, FormGroup, FormControl, ControlLabel,
  Image, Thumbnail, Button
} from "react-bootstrap";

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
      newStockLevel: props.car.stockLevel
    }
  }

  renderThumbnailImage(urls) {
    if (!urls || urls.length == 0) {
      // photo not available stock
      return (
        <div className="car-thumbnail-alt">
          Photo not availables
        </div>
      );

    } else {
      return <Image alt="Link to image is broken" src={urls[0]} alt="171x180" max-height="200px" responsive />

    }
  }
  onShowMoreImagesClick(urls) {
    console.log(urls)
  }
  renderShowMoreImages(urls) {
    if (urls && urls.length > 1) {
      // photo not available stock
      return (
        <a onClick={() => this.onShowMoreImagesClick(urls)}>
          Show more images
        </a>
      );
    }
  }

  updatingStockLevel(event, car, newStockLevel) {
    event.preventDefault();
    event.stopPropagation();

    const data = { ...car, stockLevel: newStockLevel }
    const fetchOptions = {
      method: 'PUT',
      mode: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
    this.setState({ errors: [], loading: true });
    fetch(`/API/cars/${car.id}`, fetchOptions)
      .then(response => {
        if (response.status < 300) {
          response.json().then(car => {
            const { onUpdatingItemSuccess } = this.props;
            if (onUpdatingItemSuccess && typeof onUpdatingItemSuccess === "function") {
              onUpdatingItemSuccess(car);
            }

            this.setState({ errors: [], loading: false })
          }, error => this.setState({ errors: ['Invalid Json structure'], loading: false }))
        }
        else {
          switch (response.status) {
            case 404:
              this.setState({ errors: ["API route not found"], loading: false });
              break;
            default:
              this.setState({ errors: response.json(), loading: false });
          }
        }
      })
  }
  renderUpdatingError(errors) {
    if (errors && errors.length > 0) {
      return (
        <Alert bsStyle="danger">
          {errors.join("\n")}
        </Alert>
      )
    }
  }
  render() {
    const { car, onRemoveCarClick } = this.props;
    const { newStockLevel, errors, loading } = this.state;
    return (
      <li className="list-group-item" style={{ "margin": "5px" }} >
        <h3 style={{ "margin": "5px" }}>
          {`${car.year} ${car.make} ${car.model} `}
          <Glyphicon className="pull-right clickable" glyph="remove"
            onClick={onRemoveCarClick}
          />
        </h3>
        <Row>
          <Col xs={4} >
            {this.renderThumbnailImage(car.imageUrls)}
          </Col>
          <Col xs={8}>
            <h4>{FormatMoney(car.price)}</h4>
            <h5><b>Body:</b> {car.body}</h5>
            <h5><b>Color:</b> {car.color}</h5>
            <h5><b>Stock level:</b> {car.stockLevel}</h5>
            <Form inline>
              <form onSubmit={(event) => this.updatingStockLevel(event, car, newStockLevel)} >
                <FormGroup controlId="formInlineName">
                  <ControlLabel>New stock level:</ControlLabel>{' '}
                  <FormControl type="number" placeholder="10" value={newStockLevel}
                    required
                    min="0"
                    step="1"
                    onChange={(event) => this.setState({ newStockLevel: event.target.value })}
                  />
                </FormGroup>{' '}
                <Button type="submit" bsStyle="primary"
                  disabled={loading}
                >Update</Button>
                {this.renderUpdatingError(errors)}
              </form>
            </Form>
            {this.renderShowMoreImages(car.imageUrls)}
          </Col>
        </Row>

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
          response.json().then(cars => {
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

  onUpdatingCarSuccess(updatedCar) {
    const index = this.state.cars.findIndex(car => car.id == updatedCar.id)
    this.state.cars[index] = updatedCar;
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
  addCar(event, car) {
    event.preventDefault();
    event.stopPropagation();
    console.log("Adding car", car)
  }
  renderAddCarError(errors) {
    if (errors && errors.length > 0) {
      return (
        <Alert bsStyle="danger">
          {errors.join("\n")}
        </Alert>
      )
    }
  }
  renderAddCarForm() {
    let { newCar } = this.state
    return <Form className="add-form" onSubmit={(event) => this.addCar(event, newCar)} horizontal>
      <Row>
        <Col xs={6} md={4}>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={2}>
              Make
            </Col>
            <Col sm={10}>
              <FormControl type="text" placeholder="Toyota" />
            </Col>
          </FormGroup>
        </Col>
        <Col xs={6} md={4}>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={2}>
              Model
            </Col>
            <Col sm={10}>
              <FormControl type="text" placeholder="Camry" />
            </Col>
          </FormGroup>
        </Col>
        <Col xs={6} md={4}>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={2}>
              Body
            </Col>
            <Col sm={10}>
              <FormControl type="text" placeholder="Sedan" />
            </Col>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        {this.renderAddCarError(["sample error"])}
      </Row>
      <Row>
        <Button bsStyle="primary"
          type="submit" 
          className="pull-right">Add car</Button>
      </Row>
    </Form>
  }
  render() {
    if (this.state.loading)
      return <h1>Loading...</h1>

    return (
      <div>
        {this.renderAddCarForm()}
        {this.renderLoadingError(this.state.loadingErrors)}
        {this.renderCarList(this.state.loadingErrors, this.state.cars)}
      </div>
    );
  }
}
