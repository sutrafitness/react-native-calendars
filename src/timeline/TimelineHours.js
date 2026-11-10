import range from 'lodash/range';
import times from 'lodash/times';
import React, { useCallback, useMemo, useRef } from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { buildTimeString, calcDateByPosition, calcTimeByPosition } from './helpers/presenter';
import { buildUnavailableHoursBlocks, HOUR_BLOCK_HEIGHT } from './Packer';
const TimelineHours = (props) => {
    const { format24h, start = 0, end = 24, date, unavailableHours, unavailableHoursColor, styles, onBackgroundLongPress, onBackgroundLongPressOut, width, numberOfDays = 1, timelineLeftInset = 0, testID } = props;
    const lastLongPressEventTime = useRef();
    // const offset = this.calendarHeight / (end - start);
    const offset = HOUR_BLOCK_HEIGHT;
    const unavailableHoursBlocks = buildUnavailableHoursBlocks(unavailableHours, { dayStart: start, dayEnd: end });
    const hours = useMemo(() => {
        return range(start, end + 1).map(i => {
            let timeText;
            if (i === start) {
                timeText = '';
            }
            else if (i < 12) {
                timeText = !format24h ? `${i}AM` : `${i}:00`;
            }
            else if (i === 12) {
                timeText = !format24h ? `${i}PM` : `${i}:00`;
            }
            else if (i === 24) {
                timeText = !format24h ? '12AM' : '23:59';
            }
            else {
                timeText = !format24h ? `${i - 12}PM` : `${i}:00`;
            }
            return { timeText, time: i };
        });
    }, [start, end, format24h]);
    const handleBackgroundPress = useCallback(event => {
        const yPosition = event.nativeEvent.locationY;
        const xPosition = event.nativeEvent.locationX;
        const { hour, minutes } = calcTimeByPosition(yPosition, HOUR_BLOCK_HEIGHT);
        const dateByPosition = calcDateByPosition(xPosition, timelineLeftInset, numberOfDays, date);
        lastLongPressEventTime.current = { hour, minutes, date: dateByPosition };
        const timeString = buildTimeString(hour, minutes, dateByPosition);
        onBackgroundLongPress?.(timeString, lastLongPressEventTime.current);
    }, [onBackgroundLongPress, date]);
    const handlePressOut = useCallback(() => {
        if (lastLongPressEventTime.current) {
            const { hour, minutes, date } = lastLongPressEventTime.current;
            const timeString = buildTimeString(hour, minutes, date);
            onBackgroundLongPressOut?.(timeString, lastLongPressEventTime.current);
            lastLongPressEventTime.current = undefined;
        }
    }, [onBackgroundLongPressOut, date]);
    return (<>
      <TouchableWithoutFeedback onLongPress={handleBackgroundPress} onPressOut={handlePressOut}>
        <View style={StyleSheet.absoluteFillObject}/>
      </TouchableWithoutFeedback>
      {unavailableHoursBlocks.map((block, index) => (<View key={index} style={[
                styles.unavailableHoursBlock,
                block,
                unavailableHoursColor ? { backgroundColor: unavailableHoursColor } : undefined,
                { left: timelineLeftInset }
            ]}/>))}

      {hours.map(({ timeText, time }, index) => {
            const flatLineStyle = StyleSheet.flatten(styles.line) || {};
            const lineColor = flatLineStyle.backgroundColor || '#D1D5DB';
            const DOT_SIZE = 1;
            const DOT_TOTAL_WIDTH = width;
            const renderDashedLine = (topOffset, dashKey) => (<View key={dashKey} pointerEvents="none" style={{
                    position: 'absolute',
                    top: topOffset,
                    left: timelineLeftInset,
                    width: DOT_TOTAL_WIDTH,
                    height: 0,
                    borderTopWidth: DOT_SIZE,
                    borderColor: lineColor,
                    borderStyle: 'dashed',
                    opacity: 0.25
                }}/>);
            return (<React.Fragment key={time}>
            <Text key={`timeLabel${time}`} style={[styles.timeLabel, { top: offset * index - 6, width: timelineLeftInset - 4 }]}>
              {timeText}
            </Text>
            {time === start ? null : (<View key={`line${time}`} testID={`${testID}.${time}.line`} style={[styles.line, { top: offset * index, width: width, left: timelineLeftInset }]}/>)}
            {time === end ? null : renderDashedLine(offset * (index + 0.25), `lineQuarter${time}`)}
            {<View key={`lineHalf${time}`} testID={`${testID}.${time}.lineHalf`} style={[
                        styles.line,
                        { top: offset * (index + 0.5), width: width, left: timelineLeftInset, opacity: 0.4 }
                    ]}/>}
            {time === end ? null : renderDashedLine(offset * (index + 0.75), `lineThreeQuarter${time}`)}
          </React.Fragment>);
        })}
      {times(numberOfDays, index => (<View key={index} style={[styles.verticalLine, { right: ((index + 1) * width) / numberOfDays }]}/>))}
    </>);
};
export default React.memo(TimelineHours);
