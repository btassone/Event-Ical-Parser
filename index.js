'use strict';

let ICal = require('ical.js');
let request = require('request');

const TRBC_EVENTS_URL = 'https://api.serviceu.com/rest/events/occurrences?orgKey=9c6e78a4-05c2-48b4-968e-6ed0a665b2ae&format=ical';

exports.handler = (event, context, callback) => {
    request(TRBC_EVENTS_URL, (error, response, body) => {

        let output = "";

        // If its a valid response continue
        if(response.statusCode === 200) {
            // Create the calendar, get the components, and get the events components (all)
            let calendar = ICal.parse(body);
            let calendarComponent = new ICal.Component(calendar);
            let calendarEvents = calendarComponent.getAllSubcomponents("vevent");

            // For each of the calendar events
            calendarEvents.forEach((calendarEvent) => {
                let descriptionItems = [];

                const MATCHER = "Description: ";

                // Create a calendar event object from the event and split the description by the new lines
                calendarEvent = new ICAL.Event(calendarEvent);
                descriptionItems = calendarEvent.description.split('\n');

                // For each description item
                descriptionItems.forEach((descriptionItem) => {
                    let description = '';

                    // If the description item matches the MATCHER, set the description to the right side of the match
                    // via a split
                    if(descriptionItem.indexOf(MATCHER) !== -1) {
                        description = descriptionItem.split(MATCHER)[1];
                        calendarEvent.description = description;
                    }
                });
            });

            output = ICal.stringify(calendar);
        }

        callback(null, output);
    });
};