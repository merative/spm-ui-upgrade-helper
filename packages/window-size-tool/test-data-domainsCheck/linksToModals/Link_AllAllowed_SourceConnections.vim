<?xml version="1.0" encoding="UTF-8"?>
<!--
  Copyright Merative US L.P. 2008, 2017
-->
<!-- Description                                                            -->
<!-- ===========                                                            -->
<!-- This page provides a user with a list of all duplicates created for    -->
<!-- the concern role                                                       -->
<VIEW
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:noNamespaceSchemaLocation="file://Curam/UIMSchema.xsd"
>


  <PAGE_TITLE>
    <CONNECT>
      <SOURCE NAME="TEXT" PROPERTY="PageTitle.Title"/>
    </CONNECT>
  </PAGE_TITLE>


  <PAGE_PARAMETER NAME="concernRoleID"/>


  <!-- BEGIN, CR00281651, KRK -->
  <SERVER_INTERFACE CLASS="ClientMerge" NAME="DISPLAY" OPERATION="listDuplicatesForConcernRoleDetails"/>
  <!-- END, CR00281651 -->


  <CONNECT>
    <SOURCE NAME="PAGE" PROPERTY="concernRoleID"/>
    <TARGET NAME="DISPLAY" PROPERTY="concernRoleID"/>
  </CONNECT>


  <ACTION_SET BOTTOM="false">
    <ACTION_CONTROL LABEL="ActionControl.Label.MarkNewDuplicate">
      <CONDITION>


        <IS_TRUE NAME="DISPLAY" PROPERTY="markNewDuplicateInd"/>


      </CONDITION>
      <LINK OPEN_MODAL="true" PAGE_ID="AllAllowed_TwoSourceConnections_FromLink" WINDOW_OPTIONS="width=940">
        <CONNECT>
          <SOURCE NAME="PAGE" PROPERTY="concernRoleID"/>
          <TARGET NAME="PAGE" PROPERTY="originalConcernRoleID"/>
        </CONNECT>
        <CONNECT>
          <SOURCE NAME="DISPLAY" PROPERTY="description"/>
          <TARGET NAME="PAGE" PROPERTY="contextDescription"/>
        </CONNECT>
      </LINK>
    </ACTION_CONTROL>
  </ACTION_SET>


  <LIST>


    <DETAILS_ROW>


      <INLINE_PAGE PAGE_ID="Participant_viewDuplicate">
        <CONNECT>
          <!-- BEGIN, CR00281651, KRK -->
          <SOURCE NAME="DISPLAY" PROPERTY="dtls$concernRoleDuplicateID"/>
          <!-- END, CR00281651 -->
          <TARGET NAME="PAGE" PROPERTY="concernRoleDuplicateID"/>
        </CONNECT>
        <CONNECT>
          <SOURCE NAME="DISPLAY" PROPERTY="description"/>
          <TARGET NAME="PAGE" PROPERTY="contextDescription"/>
        </CONNECT>
      </INLINE_PAGE>


    </DETAILS_ROW>


    <ACTION_SET TYPE="LIST_ROW_MENU">

      <ACTION_CONTROL LABEL="ActionControl.Label.ResumeMerge">
        <CONDITION>


          <IS_TRUE NAME="DISPLAY" PROPERTY="inMergeInd"/>


        </CONDITION>
        <LINK OPEN_MODAL="TRUE" PAGE_ID="Participant_mergeWizardForViewDuplicate">
          <CONNECT>
            <!-- BEGIN, CR00281651, KRK -->
            <SOURCE NAME="DISPLAY" PROPERTY="dtls$concernRoleDuplicateID"/>
            <!-- END, CR00281651 -->
            <TARGET NAME="PAGE" PROPERTY="concernRoleDuplicateID"/>
          </CONNECT>
          <CONNECT>
            <SOURCE NAME="DISPLAY" PROPERTY="concernRoleID"/>
            <TARGET NAME="PAGE" PROPERTY="originalConcernRoleID"/>
          </CONNECT>
          <CONNECT>
            <!-- BEGIN, CR00281651, KRK -->
            <SOURCE NAME="DISPLAY" PROPERTY="dtls$duplicateConcernRoleID"/>
            <!-- END, CR00281651 -->
            <TARGET NAME="PAGE" PROPERTY="duplicateConcernRoleID"/>
          </CONNECT>
        </LINK>
      </ACTION_CONTROL>
      <ACTION_CONTROL LABEL="ActionControl.Label.Unmark">
        <CONDITION>


          <IS_TRUE NAME="DISPLAY" PROPERTY="markedInd"/>


        </CONDITION>
        <LINK OPEN_MODAL="TRUE" PAGE_ID="Participant_unmarkDuplicate">
          <CONNECT>
            <SOURCE NAME="DISPLAY" PROPERTY="concernRoleID"/>
            <TARGET NAME="PAGE" PROPERTY="originalConcernRoleID"/>
          </CONNECT>
          <CONNECT>
            <!-- BEGIN, CR00281651, KRK -->
            <SOURCE NAME="DISPLAY" PROPERTY="dtls$duplicateConcernRoleID"/>
            <!-- END, CR00281651 -->
            <TARGET NAME="PAGE" PROPERTY="duplicateConcernRoleID"/>
          </CONNECT>
          <CONNECT>
            <!-- BEGIN, CR00281651, KRK -->
            <SOURCE NAME="DISPLAY" PROPERTY="dtls$concernRoleDuplicateID"/>
            <!-- END, CR00281651 -->
            <TARGET NAME="PAGE" PROPERTY="concernRoleDuplicateID"/>
          </CONNECT>
        </LINK>
      </ACTION_CONTROL>
    </ACTION_SET>


    <FIELD LABEL="Field.Label.Name" WIDTH="20">
      <CONNECT>
        <!-- BEGIN, CR00281651, KRK -->
        <SOURCE NAME="DISPLAY" PROPERTY="dtls$concernRoleName"/>
        <!-- END, CR00281651 -->
      </CONNECT>
      <LINK PAGE_ID="Participant_resolveConcernRoleTypeHome">
        <CONNECT>
          <!-- BEGIN, CR00281651, KRK -->
          <SOURCE NAME="DISPLAY" PROPERTY="dtls$duplicateConcernRoleID"/>
          <!-- END, CR00281651 -->
          <TARGET NAME="PAGE" PROPERTY="concernRoleID"/>
        </CONNECT>
      </LINK>
    </FIELD>


    <FIELD LABEL="Field.Label.MarkDuplicateDate" WIDTH="20">
      <CONNECT>
        <!-- BEGIN, CR00281651, KRK -->
        <SOURCE NAME="DISPLAY" PROPERTY="result$detailsList$dtlsList$dtls$duplicateDateTime"/>
        <!-- END, CR00281651 -->
      </CONNECT>
    </FIELD>


    <FIELD LABEL="Field.Label.MergeStartDate" WIDTH="20">
      <CONNECT>
        <!-- BEGIN, CR00281651, KRK -->
        <SOURCE NAME="DISPLAY" PROPERTY="result$detailsList$dtlsList$dtls$mergeStartDate"/>
        <!-- END, CR00281651 -->
      </CONNECT>
    </FIELD>


    <FIELD LABEL="Field.Label.MergeEndDate" WIDTH="20">
      <CONNECT>
        <!-- BEGIN, CR00281651, KRK -->
        <SOURCE NAME="DISPLAY" PROPERTY="result$detailsList$dtlsList$dtls$mergeEndDate"/>
        <!-- END, CR00281651 -->
      </CONNECT>
    </FIELD>


    <FIELD LABEL="Field.Label.UnmarkDate" WIDTH="20">
      <CONNECT>
        <!-- BEGIN, CR00281651, KRK -->
        <SOURCE NAME="DISPLAY" PROPERTY="result$detailsList$dtlsList$dtls$unmarkDateTime"/>
        <!-- END, CR00281651 -->
      </CONNECT>
    </FIELD>


  </LIST>
</VIEW>
