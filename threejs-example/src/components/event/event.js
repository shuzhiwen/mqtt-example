class Event {
  constructor() {
    this.events = new Array();
  }

  registerEvent = (event, id = Math.random().toString()) => {
    if (this.events.findIndex((eventObject) => eventObject.id === id) < 0) {
      typeof event === 'function' && this.events.push({ event, id });
    }
  };

  fireEvents = () => {
    for (const index in this.events) {
      this.events[index].event();
    }
  };

  removeEvent = (id) => {
    const index = this.events.findIndex((eventObject) => eventObject.id === id);
    if (index >= 0) {
      delete this.events[index];
    }
  };
}

export default Event;
