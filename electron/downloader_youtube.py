from pytube import YouTube;
import sys;
import os;
import json;

def downloadOnlyAudio(yt, path):
    audio = yt.streams.get_audio_only();
    audio_default_name = audio.default_filename;
    audio_mp3 = os.path.splitext(audio_default_name)[0] + '.mp3';
    audio.download(output_path=path, filename = audio_mp3);
    

def downloadVideo(videoData, directory):
    url, onlyAudio, resolution = videoData.values();
    yt = YouTube(url);
    if(onlyAudio):
        downloadOnlyAudio(yt, directory);
        return "Download AUDIO";
    video_lower = yt.streams.filter(progressive=True).first();
    video_higher = yt.streams.get_highest_resolution();
    if(resolution == 'higher'):
        video_higher.download(output_path=directory);
    else:
        video_lower.download(output_path=directory);
    return "Download VIDEO";

video_data = sys.argv[1];
directory_path = sys.argv[2];
video_data_parse = json.loads(video_data);

print(f"The videoData is {video_data_parse}");
downloadVideo(video_data_parse, directory_path);