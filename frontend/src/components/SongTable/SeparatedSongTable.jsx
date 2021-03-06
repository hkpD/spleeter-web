import React, { Component } from 'react'
import { Badge, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap'
import BootstrapTable from 'react-bootstrap-table-next'
import { toRelativeDateSpan } from '../../Utils'
import PausePlayButton from './PausePlayButton'

import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import './SeparatedSongTable.css'

const statusVariantMap = {
  'Done': 'success',
  'Error': 'danger',
  'In Progress': 'primary',
  'Queued': 'secondary'
}

const playColFormatter = (cell, row, rowIndex, formatExtraData) => {
  const {
    currentSongUrl,
    isPlaying,
    onPauseClick,
    onPlayClick
  } = formatExtraData
  const isPlayingCurrent = isPlaying && currentSongUrl === row.url

  return (
    <div className="d-flex align-items-center justify-content-center">
      <PausePlayButton
        playing={isPlayingCurrent}
        disabled={!row.url}
        disabledText="Processing"
        song={row}
        onPauseClick={onPauseClick}
        onPlayClick={onPlayClick}
      />
    </div>
  )
}

const downloadFormatter = (cell, row, rowIndex) => {
  const { url } = row
  if (url) {
    return (
      <a href={url} download>
        Link
      </a>
    )
  } else {
    return null
  }
}

class SeparatedSongTable extends Component {
  render() {
    const {
      data,
      currentSongUrl,
      isPlaying,
      onPauseClick,
      onPlayClick
    } = this.props
    const columns = [
      {
        dataField: 'url',
        text: '',
        formatter: playColFormatter,
        formatExtraData: {
          currentSongUrl: currentSongUrl,
          isPlaying: isPlaying,
          onPauseClick: onPauseClick,
          onPlayClick: onPlayClick
        },
        headerStyle: () => {
          return { width: '65px' }
        }
      },
      {
        dataField: 'parts',
        isDummyField: true,
        text: 'Included parts',
        formatter: (cellContent, row) => {
          const vocalBadge = row.vocals ? (
            <Badge pill variant="vocals">
              Vocals
            </Badge>
          ) : (
            <Badge pill variant="vocals-faded">
              Vocals
            </Badge>
          )
          const accompBadge = row.other ? (
            <Badge pill variant="accomp">
              Accompaniment
            </Badge>
          ) : (
            <Badge pill variant="accomp-faded">
              Accompaniment
            </Badge>
          )
          const drumsBadge = row.drums ? (
            <Badge pill variant="drums">
              Drums
            </Badge>
          ) : (
            <Badge pill variant="drums-faded">
              Drums
            </Badge>
          )
          const bassBadge = row.bass ? (
            <Badge pill variant="bass">
              Bass
            </Badge>
          ) : (
            <Badge pill variant="bass-faded">
              Bass
            </Badge>
          )
          return (
            <h5 className="mb-0">
              {vocalBadge} {accompBadge} {bassBadge} {drumsBadge}
            </h5>
          )
        }
      },
      {
        dataField: 'date_created',
        text: 'Created',
        formatter: toRelativeDateSpan,
        sort: true
      },
      {
        dataField: 'status',
        text: 'Status',
        formatter: (cellValue, row) => {
          const variant = cellValue ? statusVariantMap[cellValue] : 'secondary'
          const badgeLabel = cellValue ? cellValue : 'Other'

          if (cellValue === 'Error') {
            function renderErrorTooltip(props) {
              const errorText = row.error ? row.error : 'Unknown Error'
              return (
                <Tooltip id="button-tooltip" {...props}>
                  {errorText}
                </Tooltip>
              )
            }
            const ErrorOverlay = () => (
              <OverlayTrigger
                placement="right"
                delay={{ show: 100, hide: 100 }}
                overlay={renderErrorTooltip}>
                <Badge variant={variant}>{badgeLabel}</Badge>
              </OverlayTrigger>
            )
            return (
              <h5 className="mb-0">
                <ErrorOverlay />
              </h5>
            )
          } else if (cellValue === 'In Progress') {
            return (
              <h5 className="mb-0">
                <Badge variant={variant}>{badgeLabel}</Badge>
                <Spinner
                  className="ml-2"
                  animation="border"
                  variant="primary"
                  size="sm"
                />
              </h5>
            )
          }
          return (
            <h5 className="mb-0">
              <Badge variant={variant}>{badgeLabel}</Badge>
            </h5>
          )
        },
        sort: true
      },
      {
        dataField: 'file',
        text: 'Download',
        formatter: downloadFormatter
      }
    ]
    const sort = { dataField: 'date_created', order: 'desc' }

    if (data.length > 0) {
      return (
        <div>
          <BootstrapTable
            classes="inner-table mb-0"
            bootstrap4
            keyField="id"
            data={data}
            columns={columns}
            sort={sort}
            defaultSortDirection="asc"
            bordered={false}
          />
        </div>
      )
    } else {
      return (
        <div className="m-4 text-center">
          <p>
            No separated tracks. Press the "Spleet" button to separate this song.
          </p>
        </div>
      )
    }
  }
}

export default SeparatedSongTable
