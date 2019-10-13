import { gettext } from "i18n";

function settingsComponent(props) {
  let imageWidth = props.settingsStorage.getItem("imageWidth") || "348";
  let imageHeight = props.settingsStorage.getItem("imageHeight") || "250";
  let clientId = props.settingsStorage.getItem("clientId") || "0";
  let token = props.settingsStorage.getItem("token") || "0";

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
        description={<Text align="left">{gettext("nearby_station_desc")}</Text>}>
        <Toggle
          settingsKey="location"
          label={gettext("nearby_station_toggle")}
        />
      </Section>
      <Section
        description={<Text align="left">{gettext("stations_desc")}<Link source="http://aqicn.org"> World AQI Project</Link></Text>}
        title={<Text align="left">{gettext("stations_title")}</Text>}>
        <AdditiveList
          title={gettext("stations_additivelist_title")}
          settingsKey="stations"
          maxItems="2"
          addAction={
            <TextInput
              title={gettext("stations_input_title")}
              label={gettext("stations_input_label")}
              placeholder={gettext("stations_input_placeholder")}
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
        description={<Text align="left">{gettext("general_desc")}</Text>}
        title={<Text align="left">{gettext("general_title")}</Text>}>
        <Select
          title={gettext("general_wake_title")}
          label={gettext("general_wake_label")}
          settingsKey="wakeInterval"
          options={[
            { name: gettext("hourly"), value: 3600000 },
            { name: gettext("30mins"), value: 1800000 },
            { name: gettext("disabled"), value: 0 }
          ]}
        />
        <Toggle
          settingsKey="trackHistory"
          label={gettext("general_history_toggle")}
        />
      </Section>
      <Section
        description={<Text align="left">{gettext("background_desc")}</Text>}
        title={<Text align="left">{gettext("background_title")}</Text>}>
        <ImagePicker
          title={gettext("background_picker_title")}
          label={gettext("background_picker_label")}
          settingsKey="backgroundImage"
          imageWidth={imageWidth}
          imageHeight={imageHeight}
        />
        <Button
          label={gettext("background_button")}
          onClick={() => props.settingsStorage.removeItem("backgroundImage")}
        />
      </Section>
      <Section
        description={<Text align="left">{gettext("analytics_desc")}{JSON.parse(clientId)}</Text>}
        title={<Text align="left">{gettext("analytics_title")}</Text>}>
        <Toggle
          settingsKey="analytics"
          label={gettext("analytics_toggle")}
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(settingsComponent);