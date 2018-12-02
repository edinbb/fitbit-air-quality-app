function settingsComponent(props) {
  let imageWidth = props.settingsStorage.getItem("imageWidth") || "348";
  let imageHeight = props.settingsStorage.getItem("imageHeight") || "250";
  let clientId = props.settingsStorage.getItem("clientId") || "0";
  let token = props.settingsStorage.getItem("token") || "0";
  let userLocale = props.settingsStorage.getItem("userLocale");

  const LOCALIZED_STRINGS = {
    "en-US": {
      "nearby_station_desc": "Show air quality data from the nearby monitoring station. Please note that stations are not active all the time.The next nearby station will be dynamically selected if previously selected station is not active.",
      "nearby_station_toggle": "Nearby Station",
      "stations_desc": "Enter city name to see available air quality monitoring stations for the area. Data Source:",
      "stations_title": "Monitoring Stations",
      "stations_additivelist_title": "Selected stations",
      "stations_input_title": "Add monitoring station",
      "stations_input_label": "Add station",
      "stations_input_placeholder": "Enter city name",
      "general_desc": "Setting tracking to OFF or disabling fetching will clear stored historical data.",
      "general_title": "General",
      "general_wake_title": "Select fetch schedule",
      "general_wake_label": "Fetch schedule",
      "general_history_toggle": "Track historical data",
      "background_desc": "You may need to restart the app for the changes to take effect.",
      "background_title": "App Background",
      "background_picker_title": "Image Picker",
      "background_picker_label": "Upload an image",
      "background_button": "Remove background image",
      "analytics_desc": "Help me improve app by sending anonymous usage data. The following data will be tracked: usage statistics, crash and exception data. Your ID: ",
      "analytics_title": "Analytics",
      "analytics_toggle": "Share Analytics",
      "hourly": "Hourly",
      "30mins": "Every 30 Minutes",
      "disabled": "Disabled",
    }
  };

  function _(key) {    
    let strings = LOCALIZED_STRINGS[userLocale]
      || LOCALIZED_STRINGS["en-US"];
    let str = strings[key] || key;
    var args = [].slice.call(arguments, 1);
    args.forEach((arg, i) => str = str.replace(`{${i}}`, arg));
    return str;
  }

  function search(value) {
    let url = `https://api.waqi.info/search/?token=${JSON.parse(token)}&keyword=${value}`;
    return fetch(url)
      .then((resp) => {
        if (resp.ok) return resp.json();
        throw ("Response is not 200");
      })
      .then((res) => {
        if (res.status === "error") throw (res.data);
        let ret = [];
        for (let i = 0; i < res.data.length; i++) {
          const el = res.data[i];
          ret.push({
            name: el.station.name,
            uid: el.uid,
            time: el.time.stime
          });
        }
        return ret;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return (
    <Page>
      <Section
        description={<Text align="left">{_("nearby_station_desc")}</Text>}>
        <Toggle
          settingsKey="location"
          label={_("nearby_station_toggle")}
        />
      </Section>
      <Section
        description={<Text align="left">{_("stations_desc")}<Link source="http://aqicn.org"> World AQI Project</Link></Text>}
        title={<Text align="left">{_("stations_title")}</Text>}>
        <AdditiveList
          title={_("stations_additivelist_title")}
          settingsKey="stations"
          maxItems="2"
          addAction={
            <TextInput
              title={_("stations_input_title")}
              label={_("stations_input_label")}
              placeholder={_("stations_input_placeholder")}
              onAutocomplete={(value) => search(value)}
              renderAutocomplete={(option) =>
                <TextImageRow
                  label={option.name} />
              }
            />
          }
        />
      </Section>
      <Section
        description={<Text align="left">{_("general_desc")}</Text>}
        title={<Text align="left">{_("general_title")}</Text>}>
        <Select
          title={_("general_wake_title")}
          label={_("general_wake_label")}
          settingsKey="wakeInterval"
          options={[
            { name: _("hourly"), value: 3600000 },
            { name: _("30mins"), value: 1800000 },
            { name: _("disabled"), value: 0 }
          ]}
        />
        <Toggle
          settingsKey="trackHistory"
          label={_("general_history_toggle")}
        />
      </Section>
      <Section
        description={<Text align="left">{_("background_desc")}</Text>}
        title={<Text align="left">{_("background_title")}</Text>}>
        <ImagePicker
          title={_("background_picker_title")}
          label={_("background_picker_label")}
          settingsKey="backgroundImage"
          imageWidth={imageWidth}
          imageHeight={imageHeight}
        />
        <Button
          label={_("background_button")}
          onClick={() => props.settingsStorage.removeItem("backgroundImage")}
        />
      </Section>
      <Section
        description={<Text align="left">{_("analytics_desc")}{JSON.parse(clientId)}</Text>}
        title={<Text align="left">{_("analytics_title")}</Text>}>
        <Toggle
          settingsKey="analytics"
          label={_("analytics_toggle")}
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(settingsComponent);