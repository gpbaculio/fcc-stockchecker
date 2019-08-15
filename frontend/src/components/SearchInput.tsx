import React, { Component } from 'react';
import { Input } from 'reactstrap';
import axios from 'axios';

interface SearchInputState {
  [text: string]: string | number | boolean;
  delayTimer: number;
  loading: boolean;
}
class SearchInput extends Component<{}, SearchInputState> {
  state = {
    text: '',
    delayTimer: 0,
    loading: false
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
          this.setState({ loading: true });
          const timer = window.setTimeout(async () => {
            await this.fetchSymbol(text);
          }, 2000);
          this.setState({ delayTimer: timer });
        }
      }
    );
  };
  fetchSymbol = async (text: string) => {
    const { data } = await axios.get(`/api/search-symbol?keywords=${text}`);
    console.log('data ', data);
  };
  render() {
    const { text } = this.state;
    return (
      <div>
        <Input value={text} onChange={this.onChange} />
      </div>
    );
  }
}

export default SearchInput;
