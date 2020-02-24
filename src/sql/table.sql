CREATE TABLE TREND(
    trendDate DATE,
    PRIMARY KEY(trendDate)
);

CREATE TABLE CHANNEL(
    channelId VARCHAR(16),
    channelTitle VARCHAR(128) NOT NULL,
    PRIMARY KEY(channelId)
);

CREATE TABLE TAG(
    tagId INT AUTO_INCREMENT,
    tagName VARCHAR(64) NOT NULL,
    PRIMARY KEY(tagId),
    UNIQUE(tagName)
);

CREATE TABLE VIDEO(
  videoId VARCHAR(16),
  channelId VARCHAR(16) NOT NULL,
  videoTitle VARCHAR(128) NOT NULL,
  videoDate DATETIME NOT NULL,
  categoryId VARCHAR(16) NOT NULL,
  thumbnail VARCHAR(128) NOT NULL,
  PRIMARY KEY(videoId),
  FOREIGN KEY(channelId) REFERENCES CHANNEL(channelId)
);

CREATE TABLE VIDEOTREND(
    videoId VARCHAR(16),
    trendDate DATE,
    position INT,
    PRIMARY KEY(videoId, trendDate),
    FOREIGN KEY(videoId) REFERENCES VIDEO(videoId),
    FOREIGN KEY(trendDate) REFERENCES TREND(trendDate)
);

CREATE TABLE VIDEOTAG(
    videoId VARCHAR(16),
    tagId INT,
    PRIMARY KEY(videoId, tagId),
    FOREIGN KEY(videoId) REFERENCES VIDEO(videoId),
    FOREIGN KEY(tagId) REFERENCES TAG(tagId)
);