import React, { Component } from 'react';
import {
    Row, Col,
    Form, FormGroup, FormControl, ControlLabel,
    Button
} from "react-bootstrap";
import { ErrorsAlert } from "./ErrorsAlert"
export class AddCarForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            make: "",
            model: "",
            body: "",
            year: 0,
            color: "",
            price: 0,
            stockLevel: 0,
            errors: [],
            imageUrls: [],
            loading:false
        }
    }
    addCar(event, car) {
        event.preventDefault();
        event.stopPropagation();
        // at this point it should pass all the validations
        this.setState({ errors: [], loading: true });
        
        const fetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(car)
        }
        fetch(`/API/cars`, fetchOptions)
            .then(response => {
                const { status } = response;
                if (status == 404) {
                    this.setState({ errors: ["API route not found"], loading: false });
                } else {
                    // try parsing response body as json
                    response.json().then(data => {
                        if (status < 300) {
                            const { onAddingCarSuccess } = this.props;
                            if (onAddingCarSuccess && typeof onAddingCarSuccess === "function") {
                                onAddingCarSuccess(data);
                            }
                            this.setState({ errors: [], loading: false })
                        } else {
                            this.setState({ errors: data, loading: false })
                        }
                    }, _ => this.setState({ errors: ['Invalid Json structure'], loading: false }))
                }
            })
    }

    render() {
        const { make, model, body, year, color, price, stockLevel, loading, errors } = this.state;
        // repackage, only get the car's attribute to add
        const car = { make, model, body, year, color, price, stockLevel }
        return (
            <Form className="add-form" onSubmit={(event) => this.addCar(event, car)} horizontal>
                <Row>
                    <Col xs={6} md={4}>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>
                                Make
                            </Col>
                            <Col sm={10}>
                                <FormControl type="text"
                                    required
                                    value={make}
                                    onChange={event => this.setState({ make: event.target.value })}
                                    placeholder="Toyota" />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col xs={6} md={4}>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>
                                Model
                            </Col>
                            <Col sm={10}>
                                <FormControl type="text"
                                    required
                                    value={model}
                                    onChange={event => this.setState({ model: event.target.value })}
                                    placeholder="Camry" />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col xs={6} md={4}>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>
                                Body
                            </Col>
                            <Col sm={10}>
                                <FormControl type="text" placeholder="Sedan"
                                    required
                                    value={body}
                                    onChange={event => this.setState({ body: event.target.value })}
                                />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col xs={6} md={4}>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>
                                Year
                            </Col>
                            <Col sm={10}>
                                <FormControl type="number" placeholder="1985"
                                    step="1"
                                    required
                                    min="1900"
                                    value={year}
                                    onChange={event => this.setState({ year: event.target.value })}
                                />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col xs={6} md={4}>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>
                                Price
                            </Col>
                            <Col sm={10}>
                                <FormControl type="number" placeholder="59687.99"
                                    step="0.01"
                                    required
                                    min="0"
                                    value={price}
                                    onChange={event => this.setState({ price: event.target.value })}
                                />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col xs={6} md={4}>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>
                                Color
                            </Col>
                            <Col sm={10}>
                                <FormControl type="text" placeholder="Red"
                                    value={color}
                                    onChange={event => this.setState({ color: event.target.value })}
                                />
                            </Col>
                        </FormGroup>
                    </Col>
                    <Col xs={6} md={4}>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>
                                Stock Level
                            </Col>
                            <Col sm={10}>
                                <FormControl type="number" placeholder="1"
                                    step="1"
                                    required
                                    min="0"
                                    value={stockLevel}
                                    onChange={event => this.setState({ stockLevel: event.target.value })}
                                />
                            </Col>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <ErrorsAlert errors={errors}></ErrorsAlert>
                </Row>
                <Row>
                    <Button bsStyle="primary"
                        type="submit"
                        disabled={loading}
                        className="pull-right">Add car</Button>
                </Row>
            </Form>
        )
    }
}