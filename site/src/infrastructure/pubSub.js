const subscribers = [];

const subscribe = (event, callback, id) => {
  if (id && subscribers.some(s => s.id === id)) return false;

  subscribers.push({ event, callback, id });

  return true;
}

const publish = (event, payload) => {
  const eventSubscribers = subscribers.filter(s => s.event === event);

  for (let i = 0; i < eventSubscribers.length; i += 1) {
    eventSubscribers[i].callback(payload);
  }
}

export {
  subscribe,
  publish,
}