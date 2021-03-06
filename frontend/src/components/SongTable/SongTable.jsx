import React from 'react'
import { CaretDownFill, CaretUpFill } from 'react-bootstrap-icons'
import BootstrapTable from 'react-bootstrap-table-next'
import { toRelativeDateSpan } from '../../Utils'
import PausePlayButton from './PausePlayButton'
import SeparatedSongTable from './SeparatedSongTable'
import SpleetButton from './SpleetButton'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import './SongTable.css'

/**
 * Formatter function for play column
 */
const playColFormatter = (cell, row, rowIndex, formatExtraData) => {
  const {
    currentSongUrl,
    isPlaying,
    handleSrcSongPause,
    handleSrcSongPlay
  } = formatExtraData
  const isPlayingCurrent = isPlaying && currentSongUrl === row.url
  const isDisabled = !row.url

  return (
    <div className="d-flex align-items-center justify-content-center">
      <PausePlayButton
        disabled={isDisabled}
        disabledText="Processing"
        playing={isPlayingCurrent}
        song={row}
        onPauseClick={handleSrcSongPause}
        onPlayClick={handleSrcSongPlay}
      />
    </div>
  )
}

/**
 * Formatter function for separate button column. 
 */
const spleetColFormatter = (cell, row, rowIndex, formatExtraData) => {
  const { onSpleetClick } = formatExtraData
  return (
    <div className="d-flex align-items-center justify-content-center">
      <SpleetButton onClick={onSpleetClick} song={row} />
    </div>
  )
}

/**
 * Component for the song table, containing the uploaded songs and their separated tracks.
 */
class SongTable extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      data,
      currentSongUrl,
      isPlaying,
      expandedIds,
      onSpleetClick,
      onSepSongPauseClick,
      onSepSongPlayClick,
      onSrcSongPauseClick,
      onSrcSongPlayClick,
      onExpandRow,
      onExpandAll
    } = this.props

    // Show separated song details inside expand row
    const expandRow = {
      renderer: row => {
        return (
          <SeparatedSongTable
            data={row.separated}
            currentSongUrl={currentSongUrl}
            isPlaying={isPlaying}
            onPauseClick={onSepSongPauseClick}
            onPlayClick={onSepSongPlayClick}
          />
        )
      },
      expanded: expandedIds,
      onExpand: onExpandRow,
      onExpandAll: onExpandAll,
      showExpandColumn: true,
      expandColumnPosition: 'right',
      expandByColumnOnly: true,
      expandHeaderColumnRenderer: ({ isAnyExpands }) => {
        return isAnyExpands ? <CaretUpFill /> : <CaretDownFill />
      },
      expandColumnRenderer: ({ expanded }) => {
        return expanded ? <CaretUpFill /> : <CaretDownFill />
      }
    }
    // Song table columns
    const columns = [
      {
        dataField: 'url',
        text: '',
        formatter: playColFormatter,
        formatExtraData: {
          currentSongUrl: currentSongUrl,
          isPlaying: isPlaying,
          handleSrcSongPause: onSrcSongPauseClick,
          handleSrcSongPlay: onSrcSongPlayClick
        },
        headerStyle: () => {
          return { width: '65px' }
        }
      },
      {
        dataField: 'id',
        text: 'ID',
        hidden: true
      },
      {
        dataField: 'title',
        text: 'Title',
        sort: true
      },
      {
        dataField: 'artist',
        text: 'Artist',
        sort: true
      },
      {
        dataField: 'date_created',
        text: 'Uploaded',
        formatter: toRelativeDateSpan,
        sort: true
      },
      {
        dataField: 'download_dummy',
        isDummyField: true,
        text: 'Separate Source',
        formatter: spleetColFormatter,
        formatExtraData: {
          onSpleetClick: onSpleetClick
        }
      }
    ]
    const sort = [{ dataField: 'date_created', order: 'desc' }]
    return (
      <BootstrapTable
        bootstrap4
        keyField="id"
        data={data}
        columns={columns}
        defaultSorted={sort}
        expandRow={expandRow}
        bordered={false}
      />
    )
  }
}

export default SongTable
