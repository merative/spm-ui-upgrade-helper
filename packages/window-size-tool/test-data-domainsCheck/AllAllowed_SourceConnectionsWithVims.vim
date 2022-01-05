<!--
  - Expected: No change.
  -
  - Reason: PAGE element has no WINDOW_OPTIONS attribute.
  -->
<?xml version="1.0" encoding="UTF-8"?>
<VIEW
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:noNamespaceSchemaLocation="file://Curam/UIMSchema.xsd"
>

  <PAGE_TITLE DESCRIPTION="Page.Desc">
    <CONNECT>
      <SOURCE
        NAME="TEXT"
        PROPERTY="PageTitle.StaticText1"
      />
    </CONNECT>
    <CONNECT>	
      <SOURCE NAME="TEXT" PROPERTY="PageTitle.Separator"/>	
    </CONNECT>	
    <CONNECT>	
      <SOURCE NAME="DISPLAY" PROPERTY="firstName"/>	
    </CONNECT>	
  </PAGE_TITLE>

  <SERVER_INTERFACE
    CLASS="PersonAdmin"
    PHASE="DISPLAY"
    NAME="DISPLAY_VIM1"
    OPERATION="read"
  />
  <SERVER_INTERFACE
    CLASS="PersonAdmin"
    PHASE="DISPLAY"
    NAME="DISPLAY_VIM2"
    OPERATION="read"
  />

  <ACTION_SET ALIGNMENT="CENTER">
    <ACTION_CONTROL
      LABEL="ActionControl.Label.Edit"
    >
      <LINK
        PAGE_ID="Person_modifyPerson"
      >
        <CONNECT>
          <SOURCE
            NAME="DISPLAY"
            PROPERTY="key$identifier"
          />
          <TARGET
            NAME="PAGE"
            PROPERTY="id"
          />
        </CONNECT>
      </LINK>
    </ACTION_CONTROL>
  </ACTION_SET>
  
  <PAGE_PARAMETER NAME="id"/>


  <CONNECT>
    <SOURCE
      NAME="PAGE"
      PROPERTY="id"
    />
    <TARGET
      NAME="DISPLAY"
      PROPERTY="key$identifier"
    />
  </CONNECT>


    <CLUSTER
      NUM_COLS="1"
      TITLE="Cluster.Label.Name"
      DESCRIPTION="Page.Desc"
    >
      <FIELD LABEL="Field.Label.Title">
        <CONNECT>
          <SOURCE
            NAME="DISPLAY_VIM1"
            PROPERTY="title_vim"
          />
        </CONNECT>
      </FIELD>
      <FIELD LABEL="Field.Label.FirstName">
        <CONNECT>
          <SOURCE
            NAME="DISPLAY_VIM1"
            PROPERTY="firstName_vim"
          />
        </CONNECT>
      </FIELD>
      <FIELD LABEL="Field.Label.Title">
        <CONNECT>
          <SOURCE
            NAME="DISPLAY_4"
            PROPERTY="turkeys"
          />
        </CONNECT>
        <LINK WINDOW_OPTIONS="width=940" PAGE_ID="someUIMPage">
        </LINK>
      </FIELD>


    </CLUSTER>

</VIEW>