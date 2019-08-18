import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import Axios from 'axios';

interface SingleSymbolInputProps {
  symbol: string;
}
interface SingleSymbolInputState {
  like: boolean;
  symbol: string;
  [text: string]: string | boolean;
}

class SingleSymbolInput extends Component<
  SingleSymbolInputProps,
  SingleSymbolInputState
> {
  constructor(props: SingleSymbolInputProps) {
    super(props);
    this.state = {
      like: false,
      symbol: props.symbol
    };
  }
  componentDidUpdate(
    prevProps: SingleSymbolInputProps,
    prevState: SingleSymbolInputState
  ) {
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
  onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { symbol, like } = this.state;
    const data = await Axios.get(
      `/api/stock-prices?stock=${symbol}&like=${like}`
    );
    console.log('data ', data);
  };
  render() {
    const { like, symbol } = this.state;
    return (
      <Form onSubmit={this.onSubmit} className='mx-auto' inline>
        <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
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
        <Button type='submit'>Get Price</Button>
      </Form>
    );
  }
}

export default SingleSymbolInput;
