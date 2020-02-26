CREATE TABLE TREND(
    trendDate DATETIME,
    PRIMARY KEY(trendDate)
);

CREATE TABLE CHANNEL(
    channelId VARCHAR(32),
    channelTitle VARCHAR(128) NOT NULL,
    PRIMARY KEY(channelId)
);

CREATE TABLE TAG(
    tagId INT AUTO_INCREMENT,
    tagName VARCHAR(128) NOT NULL,
    PRIMARY KEY(tagId),
    CONSTRAINT U_TAG_TAGNAME UNIQUE(tagName)
);

CREATE TABLE VIDEO(
  videoId VARCHAR(32),
  channelId VARCHAR(32) NOT NULL,
  videoTitle VARCHAR(128) NOT NULL,
  videoDate DATETIME NOT NULL,
  categoryId VARCHAR(16) NOT NULL,
  thumbnail VARCHAR(128) NOT NULL,
  viewCount INT NOT NULL,
  likeCount INT NOT NULL,
  dislikeCount INT NOT NULL,
  commentCount INT NOT NULL,
  PRIMARY KEY(videoId),
  FOREIGN KEY(channelId) REFERENCES CHANNEL(channelId)
);

CREATE TABLE VIDEOTREND(
    videoId VARCHAR(32),
    trendDate DATETIME,
    position INT,
    PRIMARY KEY(videoId, trendDate),
    FOREIGN KEY(videoId) REFERENCES VIDEO(videoId),
    FOREIGN KEY(trendDate) REFERENCES TREND(trendDate),
    CONSTRAINT U_VIDEOTREND_POSITIONDATE UNIQUE(trendDate, position)
);

CREATE TABLE VIDEOTAG(
    videoId VARCHAR(32),
    tagId INT,
    PRIMARY KEY(videoId, tagId),
    FOREIGN KEY(videoId) REFERENCES VIDEO(videoId),
    FOREIGN KEY(tagId) REFERENCES TAG(tagId)
);