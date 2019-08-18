import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import Axios from 'axios';

interface DoubleSymbolInputProps {
  symbol: string;
}

interface DoubleSymbolInputState {
  like: boolean;
  firstSymbol: string;
  secondSymbol: string;
  [text: string]: string | boolean;
}

class DoubleSymbolInput extends Component<
  DoubleSymbolInputProps,
  DoubleSymbolInputState
> {
  constructor(props: DoubleSymbolInputProps) {
    super(props);
    this.state = {
      like: false,
      firstSymbol: props.symbol,
      secondSymbol: 'MSFT'
    };
  }
  componentDidUpdate(
    prevProps: DoubleSymbolInputProps,
    _prevState: DoubleSymbolInputState
  ) {
    if (prevProps.symbol !== this.props.symbol) {
      this.setState({ firstSymbol: this.props.symbol });
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
    const { firstSymbol, secondSymbol, like } = this.state;
    const data = await Axios.get(
      `/api/stock-prices?stock=${firstSymbol}&stock=${secondSymbol}&like=${like}`
    );
    console.log('data ', data);
  };
  render() {
    const { like, firstSymbol, secondSymbol } = this.state;
    return (
      <Form onSubmit={this.onSubmit} className='mx-auto' inline>
        <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
          <Input
            onChange={this.handleInputChange}
            value={firstSymbol}
            type='text'
            name='firstSymbol'
            id='firstSymbol'
            placeholder='First Stock Symbol'
          />
        </FormGroup>
        <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
          <Input
            onChange={this.handleInputChange}
            value={secondSymbol}
            type='text'
            name='secondSymbol'
            id='secondSymbol'
            placeholder='Second Stock Symbol'
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

export default DoubleSymbolInput;
