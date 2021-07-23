<?xml version="1.0" encoding="UTF-8"?>
<!--
  This page should not be changed, not even the formatting.
-->
<?curam-deprecated Since Curam 7.0.2.0, this functionality has been replaced with something something.?>
<VIEW
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:noNamespaceSchemaLocation="file://Curam/UIMSchema.xsd"
>


  <PAGE_TITLE>
    <CONNECT>
      <SOURCE
        NAME="TEXT"
        PROPERTY="PageTitle.StaticText1"
      />
    </CONNECT>
  </PAGE_TITLE>


  <SERVER_INTERFACE
    CLASS="SomeClass"
    NAME="DISPLAY"
    OPERATION="someOperation"
    PHASE="DISPLAY"
  />


  <SERVER_INTERFACE
    CLASS="SomeClass"
    NAME="ACTION"
    OPERATION="someOperation"
    PHASE="ACTION"
  />


  <PAGE_PARAMETER NAME="someParameter"/>


  <CONNECT>
    <SOURCE
      NAME="PAGE"
      PROPERTY="someParameter"
    />
    <TARGET
      NAME="DISPLAY"
      PROPERTY="key$someParameter"
    />
  </CONNECT>


  <CONNECT>
    <SOURCE
      NAME="DISPLAY"
      PROPERTY="someDetails$someParameter"
    />
    <TARGET
      NAME="ACTION"
      PROPERTY="someParameter"
    />
  </CONNECT>


  <CONNECT>
    <SOURCE
      NAME="DISPLAY"
      PROPERTY="sourceID"
    />
    <TARGET
      NAME="ACTION"
      PROPERTY="sourceID"
    />
  </CONNECT>


  <CONNECT>
    <SOURCE
      NAME="DISPLAY"
      PROPERTY="sourceType"
    />
    <TARGET
      NAME="ACTION"
      PROPERTY="sourceType"
    />
  </CONNECT>


  <CONNECT>
    <SOURCE
      NAME="DISPLAY"
      PROPERTY="targetID"
    />
    <TARGET
      NAME="ACTION"
      PROPERTY="targetID"
    />
  </CONNECT>
  <CONNECT>
    <SOURCE
      NAME="DISPLAY"
      PROPERTY="targetType"
    />
    <TARGET
      NAME="ACTION"
      PROPERTY="targetType"
    />
  </CONNECT>
  <CONNECT>
    <SOURCE
      NAME="DISPLAY"
      PROPERTY="someSourceType"
    />
    <TARGET
      NAME="ACTION"
      PROPERTY="someSourceType"
    />
  </CONNECT>
  <CONNECT>
    <SOURCE
      NAME="DISPLAY"
      PROPERTY="someTargetType"
    />
    <TARGET
      NAME="ACTION"
      PROPERTY="someTargetType"
    />
  </CONNECT>


  <CONNECT>
    <SOURCE
      NAME="DISPLAY"
      PROPERTY="sourceSystemID"
    />
    <TARGET
      NAME="ACTION"
      PROPERTY="sourceSystemID"
    />
  </CONNECT>


  <CONNECT>
    <SOURCE
      NAME="DISPLAY"
      PROPERTY="externalSystem"
    />
    <TARGET
      NAME="ACTION"
      PROPERTY="externalSystem"
    />
  </CONNECT>


  <CONNECT>
    <SOURCE
      NAME="DISPLAY"
      PROPERTY="recordStatus"
    />
    <TARGET
      NAME="ACTION"
      PROPERTY="recordStatus"
    />
  </CONNECT>
  <CONNECT>
    <SOURCE
      NAME="DISPLAY"
      PROPERTY="versionNo"
    />
    <TARGET
      NAME="ACTION"
      PROPERTY="versionNo"
    />
  </CONNECT>
  <CONNECT>
    <SOURCE
      NAME="DISPLAY"
      PROPERTY="sharedType"
    />
    <TARGET
      NAME="ACTION"
      PROPERTY="sharedType"
    />
  </CONNECT>


  <CLUSTER NUM_COLS="2">


    <CLUSTER LABEL_WIDTH="50">
      <FIELD LABEL="Field.Label.SomeLabel">
        <CONNECT>
          <SOURCE
            NAME="DISPLAY"
            PROPERTY="someIndicator"
          />
        </CONNECT>
        <CONNECT>
          <TARGET
            NAME="ACTION"
            PROPERTY="someIndicator"
          />
        </CONNECT>
      </FIELD>


      <FIELD LABEL="Field.Label.SomeLabel">
        <CONNECT>
          <SOURCE
            NAME="DISPLAY"
            PROPERTY="someIndicator"
          />
        </CONNECT>
        <CONNECT>
          <TARGET
            NAME="ACTION"
            PROPERTY="someIndicator"
          />
        </CONNECT>
      </FIELD>
    </CLUSTER>
    <CLUSTER LABEL_WIDTH="60">
      <FIELD LABEL="Field.Label.SomeLabel">
        <CONNECT>
          <SOURCE
            NAME="DISPLAY"
            PROPERTY="someOption"
          />
        </CONNECT>
        <CONNECT>
          <TARGET
            NAME="ACTION"
            PROPERTY="someOption"
          />
        </CONNECT>
      </FIELD>
    </CLUSTER>
  </CLUSTER>


  <CLUSTER
    LABEL_WIDTH="35"
    NUM_COLS="2"
    SHOW_LABELS="false"
    TITLE="Cluster.Title.SomeTitle"
  >
    <FIELD LABEL="Field.Label.SomeLabel">
      <CONNECT>
        <TARGET
          NAME="ACTION"
          PROPERTY="someType"
        />
      </CONNECT>
    </FIELD>
    <CLUSTER
      NUM_COLS="2"
      SHOW_LABELS="false"
    >
      <FIELD LABEL="Field.Label.SomeLabel">
        <CONNECT>
          <TARGET
            NAME="ACTION"
            PROPERTY="someNumber"
          />
        </CONNECT>
      </FIELD>
      <FIELD
        LABEL="Field.Label.SomeLabel"
        USE_BLANK="true"
      >
        <CONNECT>
          <TARGET
            NAME="ACTION"
            PROPERTY="someOption"
          />
        </CONNECT>
      </FIELD>
    </CLUSTER>
  </CLUSTER>
</VIEW>
