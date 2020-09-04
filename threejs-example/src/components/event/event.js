class Event {
  constructor() {
    this.events = new Array(0);
  }

  registerEvent = (event, id = Math.random().toString()) => {
    if (this.events.findIndex((eventObject) => eventObject.id === id) < 0) {
      typeof event === 'function' && this.events.push({ event, id });
    }
  };

  fireAllEvents = () => {
    for (const index in this.events) {
      this.events[index] && this.events[index].event();
    }
  };

  unRegisterEvent = (id) => {
    const index = this.events.findIndex((eventObject) => eventObject.id === id);
    if (index >= 0) {
      delete this.events[index];
    }
  };
}

export default Event;
