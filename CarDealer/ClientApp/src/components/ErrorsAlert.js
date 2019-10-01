import React from 'react';
import {Alert} from "react-bootstrap"
export function ErrorsAlert(props) {
    const {errors} = props
    if (errors && errors.length > 0) {
        return (
            <Alert bsStyle="danger">
                {errors.join("\n")}
            </Alert>
        )
    } else {
        return ""
    }
}