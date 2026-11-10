import React, {useMemo} from 'react';
import {View, TextStyle, ViewStyle} from 'react-native';
import {calcTimeOffset} from './helpers/presenter';
import {HOUR_BLOCK_HEIGHT} from './Packer';

export interface NowIndicatorProps {
  styles: {[key: string]: ViewStyle | TextStyle};
  width: number;
  left: number;
  start?: number;
  hour?: number;
  minutes?: number;
}

const NowIndicator = (props: NowIndicatorProps) => {
  const {styles, width, left, start = 0, hour, minutes} = props;

  const indicatorPosition = calcTimeOffset(HOUR_BLOCK_HEIGHT, hour, minutes) - start * HOUR_BLOCK_HEIGHT;

  const nowIndicatorStyle = useMemo(() => {
    return [styles.nowIndicator, {top: indicatorPosition, left}];
  }, [indicatorPosition, left]);

  return (
    <View style={nowIndicatorStyle}>
      <View style={[styles.nowIndicatorLine, {width}]} />
      <View style={styles.nowIndicatorKnob} />
    </View>
  );
};

export default NowIndicator;
