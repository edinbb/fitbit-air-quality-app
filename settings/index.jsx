function settingsComponent(props) {
  let imageWidth = props.settingsStorage.getItem("imageWidth") || "348";
  let imageHeight = props.settingsStorage.getItem("imageHeight") || "250";
  let clientId = props.settingsStorage.getItem("clientId") || "0";

  function search(value) {
    let url = `https://api.waqi.info/search/?token=94478a597e41f1a4389d3114a9c2e63b4301c9d6&keyword=${value}`;
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
        description={<Text align="left"> Show air quality data from the nearby monitoring station. Please note that
        stations are not active all the time. The next nearby station will be dynamically selected if
        previously selected station is not active.</Text>}>
        <Toggle
          settingsKey="location"
          label="Nearby Station"
        />
      </Section>
      <Section
        description={<Text align="left">Enter city name to see available air quality monitoring stations for the area.
        Data Source:<Link source="http://aqicn.org"> World AQI Project</Link></Text>}
        title={<Text align="left">Monitoring Stations</Text>}>
        <AdditiveList
          title="Selected stations"
          settingsKey="stations"
          maxItems="2"
          addAction={
            <TextInput
              title="Add monitoring station"
              label="Add station"
              placeholder="Enter city name"
              onAutocomplete={(value) => search(value)}
              renderAutocomplete={(option) =>
                <TextImageRow
                  label={option.name}
                  sublabel={`Updated on ${option.time}`} />
              }
            />
          }
        />
      </Section>
      <Section
        description={<Text align="left">Setting tracking to OFF or disabling fetching will clear stored historical data.</Text>}
        title={<Text align="left">General</Text>}>
        <Select
          title="Select fetch schedule"
          label="Fetch schedule"
          settingsKey="wakeInterval"
          options={[
            { name: "Hourly", value: 3600000 },
            { name: "Every 30 Minutes", value: 1800000 },
            { name: "Disabled", value: 0 }
          ]}
        />
        <Toggle
          settingsKey="trackHistory"
          label="Track historical data"
        />
      </Section>
      <Section
        description={<Text align="left">You may need to restart the app for the changes to take effect.</Text>}
        title={<Text align="left">App Background</Text>}>
        <ImagePicker
          title="Image Picker"
          label="Upload an image"
          settingsKey="backgroundImage"
          imageWidth={imageWidth}
          imageHeight={imageHeight}
        />
        <Button
          label="Remove background image"
          onClick={() => props.settingsStorage.removeItem("backgroundImage")}
        />
      </Section>
      <Section
        description={<Text align="left"> Help me improve app by sending anonymous usage data. The following data
        will be tracked: usage statistics, crash and exception data. Your ID: {JSON.parse(clientId)}</Text>}
        title={<Text align="left">Analytics</Text>}>
        <Toggle
          settingsKey="analytics"
          label="Share Analytics"
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(settingsComponent);