
import React, { Component } from 'react';
import {
  Box,
  Heading,
  Button,
  Skeleton,
  Stack,
} from "@chakra-ui/core";
import articleService from '../services/article.service';

export default class extends Component {
  state = {
    topics: [],
    loading: true,
  }

  constructor(props) {
    super(props);
    console.log(props);

    this.loadTopics();
  }

  async loadTopics() {
    const topics = await articleService.getTopics();

    this.setState({ topics, loading: false });
  }

  render() {
    return (
      <Box
        width="100%"
        height="150px"
        overflow="hidden"
        overflowX="auto"
        display="block"
      >
        <Heading marginBottom={3} size="xl">Topics</Heading>
        {
          this.state.loading

          ? (
            <Stack direction="row">
              <Skeleton width="120px" height="100px" marginRight={4}></Skeleton>
              <Skeleton width="150px" height="100px" marginRight={4}></Skeleton>
              <Skeleton width="120px" height="100px" marginRight={4}></Skeleton>
              <Skeleton width="160px" height="100px" marginRight={4}></Skeleton>
            </Stack>
          )

          : this.state.topics.map(topic => <Topic topic={topic} />)
        }
      </Box>
    );
  }
}

const Topic = ({ topic } = {}) => {
  return (
    <Button
      size="lg"
      height="48px"
      minWidth="130px"
      border="2px"
      backgroundColor="transparent"
      marginRight={4}
    >
      { topic }
    </Button>
  );
}
