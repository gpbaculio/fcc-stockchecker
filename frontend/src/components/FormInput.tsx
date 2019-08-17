import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';

interface FormInputProps {
  symbol: string;
}
interface FormInputState {
  like: boolean;
  symbol: string;
  [text: string]: string | boolean;
}
class FormInput extends Component<FormInputProps, FormInputState> {
  constructor(props: FormInputProps) {
    super(props);
    this.state = {
      like: false,
      symbol: props.symbol
    };
  }
  componentDidUpdate(prevProps: FormInputProps, prevState: FormInputState) {
    if (prevProps.symbol !== this.props.symbol) {
      this.setState({ symbol: this.props.symbol });
    }
  }
  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = e;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  };
  render() {
    const { like, symbol } = this.state;
    console.log('symbol ', symbol);
    return (
      <Form className='mx-auto' inline>
        <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
          <Label for='exampleEmail' className='mr-sm-2'>
            Symbol
          </Label>
          <Input
            onChange={this.handleInputChange}
            value={symbol}
            type='text'
            name='symbol'
            id='stockText'
            placeholder='Stock Symbol'
          />
        </FormGroup>
        <FormGroup check className='mb-2 mr-sm-2 mb-sm-0'>
          <Label check>
            <Input
              name='like'
              onChange={this.handleInputChange}
              checked={like}
              type='checkbox'
            />
            Like?
          </Label>
        </FormGroup>
        <Button>Get Price</Button>
      </Form>
    );
  }
}

export default FormInput;
