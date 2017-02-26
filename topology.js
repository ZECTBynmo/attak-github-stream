module.exports = {
  name: 'attak-github-stream',
  processors: './processors',
  streams: [
    {
      from: 'split_users',
      to: 'github_events'
    },
    {
      from: 'github_events',
      to: 'sentiment_analysis',
      topic: 'events'
    },
    {
      from: 'github_events',
      to: 'github_events',
      topic: 'next'
    },
  ]
};