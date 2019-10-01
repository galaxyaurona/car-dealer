import React, { Component } from 'react';
import {ErrorsAlert} from "./ErrorsAlert";
import {
     Row, Col, Glyphicon,
    Form, FormGroup, FormControl, ControlLabel,
    Image, Button
  } from "react-bootstrap";
 
function FormatMoney(money) {
    if (money && !isNaN(money))
        return "$ " + money.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    else
        return "$0"
}

  
export class CustomListItem extends Component {
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
  /*onShowMoreImagesClick(urls) {
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
  }*/

  updatingStockLevel(event, car, newStockLevel) {
    event.preventDefault();
    event.stopPropagation();
 
    if (this.state.loading) return;
    const data = { ...car, stockLevel: newStockLevel }
    const fetchOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
    this.setState({ errors: [], loading: true });
    fetch(`/API/cars/${car.id}`, fetchOptions)
      .then(response => {
            const { status } = response;
            if (status == 404) {
              this.setState({ errors: ["API route not found"], loading: false });
            } else {
              // try parsing response body as json
              response.json().then(data => {
                if (status < 300) {
                    const { onUpdatingItemSuccess } = this.props;
                    if (onUpdatingItemSuccess && typeof onUpdatingItemSuccess === "function") {
                      onUpdatingItemSuccess(data);
                    }
                  this.setState({ errors:[], loading: false })
                } else {
                  this.setState({ errors: data, loading: false })
                }
              }, _ => this.setState({ errors: ['Invalid Json structure'], loading: false }))
            }
      })
  }

  
  onRemovingCarClick(event, id) {
    event.preventDefault();
    event.stopPropagation();
    if (this.state.loading) return;
    const fetchOptions = {
      method: 'DELETE',
    }
    this.setState({ errors: [], loading: true })
    fetch(`/API/cars/${id}`,fetchOptions)
      .then(response => {
            const { status } = response;
            if (status == 404) {
              this.setState({ errors: ["API route not found"], loading: false });
            } else {
              // try parsing response body as json
              response.json().then(data => {
                if (status < 300) {
                    const { onRemovingCarSuccess } = this.props;
                    if (onRemovingCarSuccess && typeof onRemovingCarSuccess === "function") {
                        onRemovingCarSuccess(data);
                    }
                  this.setState({ errors:[], loading: false })
                } else {
                  this.setState({ errors: data, loading: false })
                }
              }, _ => this.setState({ errors: ['Invalid Json structure'], loading: false }))
            }
      })
  }

  render() {
    const { car } = this.props;
    const { newStockLevel, errors, loading } = this.state;
    return (
      <li className="list-group-item" style={{ "margin": "5px" }} >
        <h3 style={{ "margin": "5px" }}>
          {`${car.year} ${car.make} ${car.model} `}
          <Glyphicon className={"pull-right " + (loading ? "disabled" : "clickable")} glyph="remove"
            disabled={loading}
            onClick={event => this.onRemovingCarClick(event, car.id)}
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
            <Form onSubmit={(event) => this.updatingStockLevel(event, car, newStockLevel)}  inline>
           
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
                <ErrorsAlert errors={errors}></ErrorsAlert>
            </Form>
          </Col>
        </Row>

      </li>
    );
  }
}