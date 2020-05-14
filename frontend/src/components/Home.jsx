import React, { Component } from 'react'
import axios from 'axios'
import { Alert } from 'react-bootstrap'
import MusicPlayer from './MusicPlayer'
import MyNavBar from './MyNavBar'
import SongTable from './SongTable/SongTable'
import SpleetModal from './SongTable/SpleetModal'
import UploadModal from './Upload/UploadModal'

/**
 * Home component where main functionality happens, consisting of the main nav bar
 * and the song table.
 */
class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showSpleetModal: false, // Whether to show source separation modal
      showUploadModal: false, // Whether to show upload modal
      songList: [],           // List of songs seen in the song table
      audioInstance: null,    // Reference audio player instance
      currentSrcSong: null,   // Current song, if it is a source song
      currentSepSong: null,   // Current song, if it is a separated song
      currentModalSong: null, // Current song displayed in the separation modal
      isPlaying: false,       // Whether audio is playing
      task: null,             // The separation task that was just submitted
      expandedIds: []         // List of IDs of expanded rows
    }
  }

  getAudioInstance = instance => {
    this.setState({
      audioInstance: instance
    })
  }

  onAudioPause = audioInfo => {
    this.setState({
      isPlaying: false
    })
  }

  onAudioPlay = audioInfo => {
    this.setState({
      isPlaying: true
    })
  }

  onSrcSongPauseClick = song => {
    this.setState({
      isPlaying: false
    })
    if (this.state.audioInstance) {
      this.state.audioInstance.pause()
    }
  }

  onSrcSongPlayClick = song => {
    if (
      this.state.currentSrcSong &&
      this.state.currentSrcSong.url === song.url
    ) {
      this.setState({
        isPlaying: true
      })
      if (this.state.audioInstance) {
        this.state.audioInstance.play()
      }
    } else {
      this.setState({
        currentSrcSong: song,
        currentSepSong: null,
        isPlaying: true
      })
    }
  }

  onSepSongPauseClick = song => {
    this.setState({
      isPlaying: false
    })
    if (this.state.audioInstance) {
      this.state.audioInstance.pause()
    }
  }

  onSepSongPlayClick = song => {
    if (this.state.currentSepSong && this.state.currentSepSong.url === song.url) {
      this.setState({
        isPlaying: true
      })
      if (this.state.audioInstance) {
        this.state.audioInstance.play()
      }
    } else {
      this.setState({
        currentSrcSong: null,
        currentSepSong: song,
        isPlaying: true
      })
    }
  }

  onSpleetTaskSubmit = (src_id, id, status) => {
    this.setState({
      task: {
        src_id: src_id,
        id: id,
        status: status
      },
      expandedIds: [...this.state.expandedIds, src_id]
    })
    this.loadData()
    // Set task state to null after 3 seconds
    setInterval(() => {
      this.setState({
        task: null
      })
    }, 3000)
  }

  /**
   * Called when single table row is expanded
   */
  onExpandRow = (row, isExpand) => {
    if (isExpand) {
      // Row is expanded, add the row ID to expanded row ID list
      this.setState({
        expandedIds: [...this.state.expandedIds, row.id]
      })
    } else {
      // Row is collapsed, remove current row ID from list
      this.setState({
        expandedIds: this.state.expandedIds.filter(s => s !== row.id)
      })
    }
  }

  /**
   * Called when the expand-all button is pressed
   */
  onExpandAll = (isExpandAll, results) => {
    if (isExpandAll) {
      // Update expanded row ID list to contain every row
      this.setState({
        expandedIds: results.map(i => i.id)
      })
    } else {
      // Clear expanded row ID list
      this.setState({
        expandedIds: []
      })
    }
  }

  onSpleetClick = song => {
    this.setState({ showSpleetModal: true, currentModalSong: song })
  }

  onUploadClick = () => {
    this.setState({ showUploadModal: true })
  }

  handleSpleetModalHide = () => {
    this.setState({ showSpleetModal: false })
  }

  handleSpleetModalExited = () => {
    this.setState({ currentModalSong: null })
  }

  handleUploadModalHide = () => {
    this.setState({ showUploadModal: false })
  }

  /**
   * Fetch song data from backend
   */
  loadData = async () => {
    this.setState({
      songList: [
        {
          artist: "Linkin Park",
          title: "In the End (Mellen Gi Remix)",
          date_created: "2020-05-14T14:02:02.209178Z",
          id: "aee38ebd-5581-42c7-919a-b4253e9f0d40",
          source_id: "3d35dfa6-7f85-4cd3-9a6c-98db4b9c0861",
          url: "https://spleeterstorage.blob.core.windows.net/media/uploads/3d35dfa6-7f85-4cd3-9a6c-98db4b9c0861/Linkin_Park_-_In_The_End_Mellen_Gi_Remix.webm",
          separated: [
            {
              artist: "Linkin Park",
              title: "In the End (Mellen Gi Remix)",
              bass: false,
              date_created: "2020-05-14T14:02:26.069318Z",
              drums: false,
              error: "",
              id: "51fa8bee-2454-4a6a-9efd-0f7aadce29e3",
              other: false,
              status: "Done",
              url: "https://spleeterstorage.blob.core.windows.net/media/separate/51fa8bee-2454-4a6a-9efd-0f7aadce29e3/Linkin_Park_-_In_The_End_Mellen_Gi_Remix_vocals.mp3",
              vocals: true
            },
            {
              artist: "Linkin Park",
              title: "In the End (Mellen Gi Remix)",
              bass: true,
              date_created: "2020-05-14T14:02:34.923641Z",
              drums: true,
              error: "",
              id: "e4392a88-6e26-40f7-936f-5b4b13251c42",
              other: true,
              status: "Done",
              url: "https://spleeterstorage.blob.core.windows.net/media/separate/e4392a88-6e26-40f7-936f-5b4b13251c42/Linkin_Park_-_In_The_End_Mellen_Gi_Remix_drums_bass_other.mp3",
              vocals: false
            },
            {
              artist: "Linkin Park",
              title: "In the End (Mellen Gi Remix)",
              bass: true,
              date_created: "2020-05-14T14:02:42.570068Z",
              drums: false,
              error: "",
              id: "4956d520-31b6-4c3c-bc0a-31b9cb22dc08",
              other: true,
              status: "Done",
              url: "https://spleeterstorage.blob.core.windows.net/media/separate/4956d520-31b6-4c3c-bc0a-31b9cb22dc08/Linkin_Park_-_In_The_End_Mellen_Gi_Remix_vocals_bass_other.mp3",
              vocals: true
            }
          ]
        },
        {
          artist: "Queen",
          title: "Bohemian Rhapsody",
          date_created: "2020-05-14T14:03:08.556608Z",
          id: "b33ed5ec-5f78-4a0c-b85c-b7d0af2e211a",
          source_id: "6d452a29-886d-481e-876d-c720b400d2a7",
          url: "https://spleeterstorage.blob.core.windows.net/media/uploads/6d452a29-886d-481e-876d-c720b400d2a7/Queen_-_Bohemian_Rhapsody.m4a",
          separated: [
            {
              artist: "Queen",
              title: "Bohemian Rhapsody",
              bass: false,
              date_created: "2020-05-14T14:04:23.760061Z",
              drums: false,
              error: "",
              id: "d1ecfa47-8ebb-4c81-a3b2-4cff00984cce",
              other: false,
              status: "Done",
              url: "https://spleeterstorage.blob.core.windows.net/media/separate/d1ecfa47-8ebb-4c81-a3b2-4cff00984cce/Queen_-_Bohemian_Rhapsody_vocals.mp3",
              vocals: true
            },
            {
              artist: "Queen",
              title: "Bohemian Rhapsody",
              bass: true,
              date_created: "2020-05-14T14:05:08.370138Z",
              drums: true,
              error: "",
              id: "fad5540b-f663-4802-963c-7ce80150dbdf",
              other: true,
              status: "Done",
              url: "https://spleeterstorage.blob.core.windows.net/media/separate/fad5540b-f663-4802-963c-7ce80150dbdf/Queen_-_Bohemian_Rhapsody_drums_bass_other.mp3",
              vocals: false
            },
            {
              artist: "Queen",
              title: "Bohemian Rhapsody",
              bass: false,
              date_created: "2020-05-14T14:05:13.877281Z",
              drums: true,
              error: "",
              id: "377e6713-65d0-49bf-9014-ca42c45a287d",
              other: false,
              status: "Done",
              url: "https://spleeterstorage.blob.core.windows.net/media/separate/377e6713-65d0-49bf-9014-ca42c45a287d/Queen_-_Bohemian_Rhapsody_drums.mp3",
              vocals: false
            }
          ],
        },
        {
          artist: "Imagine Dragons",
          title: "Believer ft. Lil Wayne",
          date_created: "2020-05-14T14:14:59.167523Z",
          id: "cd753ed0-86d7-4c70-afaa-873c2694b257",
          source_id: "80359c75-02fd-45fe-974d-56476b66c803",
          url: "https://spleeterstorage.blob.core.windows.net/media/uploads/80359c75-02fd-45fe-974d-56476b66c803/01_Believer.mp3",
          separated: [
            {
              artist: "Imagine Dragons",
              title: "Believer ft. Lil Wayne",
              bass: false,
              date_created: "2020-05-14T14:15:36.120515Z",
              drums: false,
              error: "",
              id: "6efec2bd-9a8b-4c9f-9bbf-437b8a3dedf5",
              other: false,
              status: "Done",
              url: "https://spleeterstorage.blob.core.windows.net/media/separate/6efec2bd-9a8b-4c9f-9bbf-437b8a3dedf5/Imagine_Dragons_-_Believer_ft._Lil_Wayne_vocals.mp3",
              vocals: true
            },
            {
              artist: "Imagine Dragons",
              title: "Believer ft. Lil Wayne",
              bass: true,
              date_created: "2020-05-14T14:15:43.270285Z",
              drums: true,
              error: "",
              id: "8197c7e8-80e1-4da8-af4f-fa93a3ec12af",
              other: true,
              status: "Done",
              url: "https://spleeterstorage.blob.core.windows.net/media/separate/8197c7e8-80e1-4da8-af4f-fa93a3ec12af/Imagine_Dragons_-_Believer_ft._Lil_Wayne_drums_bass_other.mp3",
              vocals: false
            },
            {
              artist: "Imagine Dragons",
              title: "Believer ft. Lil Wayne",
              bass: true,
              date_created: "2020-05-14T14:15:59.151427Z",
              drums: true,
              error: "",
              id: "3d9010f8-9db0-440c-a063-cf33b7d1dc4b",
              other: false,
              status: "Done",
              url: "https://spleeterstorage.blob.core.windows.net/media/separate/3d9010f8-9db0-440c-a063-cf33b7d1dc4b/Imagine_Dragons_-_Believer_ft._Lil_Wayne_drums_bass.mp3",
              vocals: false
            }
          ],
        }
      ]
    })
    /*
    axios
      .get('/api/source-song/')
      .then(({ data }) => {
        if (data) {
          console.log(data)
          this.setState({ songList: data })
        }
      })
      .catch(error => console.log('API errors:', error))
    */
  }

  componentDidMount() {
    this.loadData()
    // Auto-refresh data every 10 seconds
    // setInterval(this.loadData, 10000)
  }

  render() {
    const {
      songList,
      showSpleetModal,
      showUploadModal,
      currentSrcSong,
      currentSepSong,
      currentModalSong,
      isPlaying,
      task,
      expandedIds
    } = this.state
    const currentSong = currentSrcSong
      ? currentSrcSong
      : (currentSepSong
      ? currentSepSong
      : null)
    const currentSongUrl = currentSrcSong
      ? currentSrcSong.url
      : (currentSepSong
      ? currentSepSong.url
      : null)

    return (
      <div>
        <MyNavBar onUploadClick={this.onUploadClick} />
        <div className="jumbotron jumbotron-fluid bg-transparent">
          <div className="container secondary-color">
            <h2 className="display-5">Song List</h2>
            <p className="lead">Get started by uploading a song or separating an existing song.</p>
            {task && (
              <Alert variant="success">
                <span>
                  <a href={`/api/separate/${task.id}`}>{task.id}</a>:{' '}
                  {task.status}
                </span>
              </Alert>
            )}
            <SongTable
              data={songList}
              currentSongUrl={currentSongUrl}
              isPlaying={isPlaying}
              expandedIds={expandedIds}
              onExpandRow={this.onExpandRow}
              onExpandAll={this.onExpandAll}
              onSpleetClick={this.onSpleetClick}
              onSepSongPauseClick={this.onSepSongPauseClick}
              onSepSongPlayClick={this.onSepSongPlayClick}
              onSrcSongPauseClick={this.onSrcSongPauseClick}
              onSrcSongPlayClick={this.onSrcSongPlayClick}
            />
          </div>
        </div>
        <MusicPlayer
          getAudioInstance={this.getAudioInstance}
          isSource={currentSrcSong}
          song={currentSong}
          onAudioPause={this.onAudioPause}
          onAudioPlay={this.onAudioPlay}
        />
        <UploadModal
          show={showUploadModal}
          hide={this.handleUploadModalHide}
          refresh={this.loadData}
        />
        <SpleetModal
          show={showSpleetModal}
          hide={this.handleSpleetModalHide}
          exit={this.handleSpleetModalExited}
          submit={this.onSpleetTaskSubmit}
          refresh={this.loadData}
          song={currentModalSong}
        />
      </div>
    )
  }
}

export default Home
