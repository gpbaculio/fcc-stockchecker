import React, { Component } from 'react';
import { Input, Spinner } from 'reactstrap';
import axios from 'axios';

interface match {
  '1. symbol': string;
  '2. name': string;
  '3. type': string;
  '4. region': string;
  '5. marketOpen': string;
  '6. marketClose': string;
  '7. timezone': string;
  '8. currency': string;
  '9. matchScore': string;
}

interface SearchInputState {
  [text: string]: string | number | boolean | match[];
  delayTimer: number;
  loading: boolean;
  searched: boolean;
  showResult: boolean;
  matches: match[];
}
interface SearchInputProps {
  fetchStockInfo: (symbol: string) => void;
}
class SearchInput extends Component<SearchInputProps, SearchInputState> {
  state = {
    text: '',
    delayTimer: 0,
    loading: false,
    searched: false,
    showResult: false,
    matches: []
  };
  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    this.setState(
      {
        text: value
      },
      async () => {
        const { text, delayTimer } = this.state;
        if (text) {
          if (delayTimer) clearTimeout(delayTimer);
          const timer = window.setTimeout(async () => {
            await this.fetchSymbol(text);
          }, 2000);
          this.setState({ delayTimer: timer });
        }
      }
    );
  };
  fetchSymbol = async (text: string) => {
    this.setState({ loading: true });
    const {
      data: { matches }
    } = await axios.get(`/api/search-symbol?keywords=${text}`);
    if (matches) this.setState({ matches });
    this.setState({ loading: false });
  };
  handleMatchClick = async (symbol: string) => {
    this.setState({ matches: [], text: '' });
    await this.props.fetchStockInfo(symbol);
  };
  render() {
    const { text, loading, matches } = this.state;
    console.log('matches ', matches);
    return (
      <div className='search-input d-flex flex-column position-relative'>
        <Input
          placeholder='Search Stock Symbol'
          value={text}
          onChange={this.onChange}
        />
        {loading && (
          <div className='mx-auto d-flex justify-content-center'>
            <Spinner color='info' className='mr-2' /> Loading...
          </div>
        )}

        <div className='autocomplete-items'>
          {matches.map((match: match) => {
            const stock = match['2. name'].replace(
              new RegExp(text, 'gi'),
              '<strong>$&</strong>'
            );
            return (
              <div
                key={match['1. symbol']}
                onClick={() => this.handleMatchClick(match['1. symbol'])}
                dangerouslySetInnerHTML={{
                  __html: `<span>${stock}</span>`
                }}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default SearchInput;
